#!/bin/bash

# Diagnose the 403 source for ai.avs.ma Ollama proxy
# This script implements the systematic plan to find the hidden restriction

set -e

echo "🔍 Step 1: Adding debug headers to ai.avs.ma.conf..."

# Backup current config
cp /etc/nginx/sites-available/ai.avs.ma.conf /etc/nginx/sites-available/ai.avs.ma.conf.backup-debug

# Create new config with debug headers
cat > /etc/nginx/sites-available/ai.avs.ma.conf << 'EOF'
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name ai.avs.ma;
    return 301 https://$server_name$request_uri;
}

# HTTPS server for Ollama proxy
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ai.avs.ma;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/avs.ma/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/avs.ma/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Health check endpoint with DEBUG header
    location = /api/version {
        add_header X-Debug "ai.avs.ma-version-location" always;
        proxy_pass http://127.0.0.1:11434/api/version;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        add_header Access-Control-Allow-Origin "*" always;
    }

    # Ollama API proxy with DEBUG header
    location /api/ {
        add_header X-Debug "ai.avs.ma-api-location" always;
        
        # CRITICAL: Allow all requests (override any inherited deny rules)
        allow all;
        
        proxy_pass http://127.0.0.1:11434/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Handle long AI responses
        proxy_buffering off;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
        proxy_connect_timeout 60s;
        client_max_body_size 10m;
        
        # CORS headers
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
        
        if ($request_method = OPTIONS) {
            return 204;
        }
    }

    # Everything else
    location / {
        return 404;
    }

    access_log /var/log/nginx/ollama-ai.access.log;
    error_log /var/log/nginx/ollama-ai.error.log;
}
EOF

echo "✅ Debug headers added"
echo ""

# Test configuration
echo "🧪 Testing nginx configuration..."
if ! nginx -t; then
    echo "❌ Config test failed! Restoring backup..."
    cp /etc/nginx/sites-available/ai.avs.ma.conf.backup-debug /etc/nginx/sites-available/ai.avs.ma.conf
    exit 1
fi

# Reload nginx
echo "🔄 Reloading nginx..."
systemctl reload nginx
sleep 2

echo ""
echo "🧪 Step 1 Test: Request with --resolve (should show X-Debug header)..."
curl -i -sS --resolve ai.avs.ma:443:127.0.0.1 https://ai.avs.ma/api/version | grep -E "HTTP|X-Debug|access-control"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🔍 Step 2: Creating forced-200 test version..."

cat > /etc/nginx/sites-available/ai.avs.ma.conf << 'EOF'
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name ai.avs.ma;
    return 301 https://$server_name$request_uri;
}

# HTTPS server for Ollama proxy
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ai.avs.ma;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/avs.ma/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/avs.ma/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    # FORCED 200 TEST - bypassing proxy completely
    location = /api/version {
        add_header X-Debug "FORCED-200-TEST" always;
        add_header Content-Type "application/json" always;
        add_header Access-Control-Allow-Origin "*" always;
        return 200 '{"test":"forced-ok","version":"test"}';
    }

    # Ollama API proxy
    location /api/ {
        add_header X-Debug "ai.avs.ma-api-location" always;
        allow all;
        
        proxy_pass http://127.0.0.1:11434/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_buffering off;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
        proxy_connect_timeout 60s;
        client_max_body_size 10m;
        
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
        
        if ($request_method = OPTIONS) {
            return 204;
        }
    }

    location / {
        return 404;
    }

    access_log /var/log/nginx/ollama-ai.access.log;
    error_log /var/log/nginx/ollama-ai.error.log;
}
EOF

nginx -t && systemctl reload nginx
sleep 2

echo ""
echo "🧪 Step 2 Test: Forced 200 response (if still 403, it's inherited)..."
curl -i -sS --resolve ai.avs.ma:443:127.0.0.1 https://ai.avs.ma/api/version | grep -E "HTTP|X-Debug|test"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🔍 Step 3: Searching compiled nginx config for hidden restrictions..."
echo ""

echo "📋 3a) Searching for deny/limit_except/satisfy/auth_request/return 403:"
sudo nginx -T 2>&1 | grep -nE '\sdeny(\s|;)|limit_except|satisfy|auth_request|return\s+403' | head -50

echo ""
echo "📋 3b) Searching for GeoIP restrictions:"
sudo nginx -T 2>&1 | grep -nE 'geoip|geo:|$geoip|geoip_country|geoip_city|if\s*\(.*geoip' | head -50

echo ""
echo "📋 3c) Searching for suspicious includes:"
sudo nginx -T 2>&1 | grep -nE 'include\s+\/etc\/nginx\/.*(cloudflare|access|restrict|security|block|ban|limit).*' | head -50

echo ""
echo "📋 3d) Full context around ai.avs.ma server blocks:"
sudo nginx -T 2>&1 | grep -A 80 "server_name ai.avs.ma" | head -200

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🔍 Step 4: Testing with global_settings disabled..."
echo ""

# Backup nginx.conf
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup-debug

# Comment out global_settings include
sed -i 's/^\s*include \/etc\/nginx\/global_settings;/  # include \/etc\/nginx\/global_settings;  # TEMPORARILY DISABLED FOR DEBUG/' /etc/nginx/nginx.conf

echo "📋 Verifying global_settings is commented out:"
grep "global_settings" /etc/nginx/nginx.conf

nginx -t && systemctl reload nginx
sleep 2

echo ""
echo "🧪 Step 4 Test: With global_settings disabled..."
curl -i -sS --resolve ai.avs.ma:443:127.0.0.1 https://ai.avs.ma/api/version | grep -E "HTTP|X-Debug"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📊 DIAGNOSIS SUMMARY:"
echo "===================="
echo ""
echo "1. If Step 1 showed X-Debug header but 403 → config reached, but blocked"
echo "2. If Step 2 FORCED 200 still gave 403 → inherited/global restriction"
echo "3. If Step 4 (global_settings disabled) gave 200 → global_settings is culprit"
echo ""
echo "🔧 Next steps based on results above:"
echo "- If global_settings caused it: move those headers into specific vhosts only"
echo "- If GeoIP found: disable GeoIP for ai.avs.ma or allow all regions"
echo "- If Cloudflare IPs found: add 'include /etc/nginx/cloudflare/ips;' INSIDE /api/ location with proper allow all;"
echo ""
echo "💾 Backups created:"
echo "  - /etc/nginx/sites-available/ai.avs.ma.conf.backup-debug"
echo "  - /etc/nginx/nginx.conf.backup-debug"
echo ""
echo "🔄 To restore original configs:"
echo "  cp /etc/nginx/sites-available/ai.avs.ma.conf.backup-debug /etc/nginx/sites-available/ai.avs.ma.conf"
echo "  cp /etc/nginx/nginx.conf.backup-debug /etc/nginx/nginx.conf"
echo "  nginx -t && systemctl reload nginx"
