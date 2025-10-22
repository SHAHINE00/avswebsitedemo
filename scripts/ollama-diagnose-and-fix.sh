#!/bin/bash

# Comprehensive Ollama Nginx 403 Diagnostic and Fix Script
# This script identifies and resolves conflicts causing 403 errors

set -e

echo "🔍 Starting comprehensive Ollama Nginx diagnostics..."
echo ""

# Configuration
NGINX_SITE_FILE="/etc/nginx/sites-available/ai.avs.ma.conf"
NGINX_ENABLED_LINK="/etc/nginx/sites-enabled/ai.avs.ma.conf"

# Step 1: Find duplicate server blocks
echo "=========================================="
echo "Step 1: Checking for duplicate server blocks"
echo "=========================================="
echo "Searching for all files that declare 'server_name ai.avs.ma':"
sudo grep -R "server_name .*ai\.avs\.ma" -n /etc/nginx 2>/dev/null || echo "No matches found"
echo ""

# Step 2: Search for hard 403/deny rules
echo "=========================================="
echo "Step 2: Searching for hard 403/deny rules"
echo "=========================================="
echo "Files with 'return 403':"
sudo grep -R "return 403" -n /etc/nginx 2>/dev/null | head -20 || echo "No 403 returns found"
echo ""
echo "Files with 'deny all':"
sudo grep -R "deny all" -n /etc/nginx 2>/dev/null | head -20 || echo "No deny all rules found"
echo ""
echo "Files with 'modsecurity':"
sudo grep -R "modsecurity" -n /etc/nginx 2>/dev/null | head -20 || echo "No modsecurity directives found"
echo ""

# Step 3: Show active ai.avs.ma.conf content
echo "=========================================="
echo "Step 3: Current ai.avs.ma.conf content"
echo "=========================================="
if [ -f "$NGINX_SITE_FILE" ]; then
    sudo cat "$NGINX_SITE_FILE"
else
    echo "⚠️  File not found: $NGINX_SITE_FILE"
fi
echo ""

# Step 4: Dump recent error logs
echo "=========================================="
echo "Step 4: Recent error logs"
echo "=========================================="
echo "Last 30 lines of /var/log/nginx/ollama-ai.error.log:"
sudo tail -n 30 /var/log/nginx/ollama-ai.error.log 2>/dev/null || echo "Log file not found or empty"
echo ""
echo "Last 30 lines of /var/log/nginx/error.log:"
sudo tail -n 30 /var/log/nginx/error.log 2>/dev/null || echo "Log file not found or empty"
echo ""

# Step 5: Confirm loaded configs
echo "=========================================="
echo "Step 5: Nginx configuration analysis"
echo "=========================================="
echo "All 'include' directives in loaded config:"
sudo nginx -T 2>&1 | grep -n "include" | head -30
echo ""
echo "Server blocks for ai.avs.ma:"
sudo nginx -T 2>&1 | grep -n "server_name.*ai\.avs\.ma"
echo ""

# Step 6: Check which files are enabled
echo "=========================================="
echo "Step 6: Active site configurations"
echo "=========================================="
echo "Files in /etc/nginx/sites-enabled/:"
ls -la /etc/nginx/sites-enabled/
echo ""

# Step 7: Test local Ollama
echo "=========================================="
echo "Step 7: Testing local Ollama"
echo "=========================================="
echo "Testing http://127.0.0.1:11434/api/version:"
curl -sS -i http://127.0.0.1:11434/api/version | head -5
echo ""

# Step 8: Test HTTPS endpoint
echo "=========================================="
echo "Step 8: Testing HTTPS endpoint"
echo "=========================================="
echo "Testing https://ai.avs.ma/api/version:"
curl -sS -i https://ai.avs.ma/api/version | head -10
echo ""

echo "=========================================="
echo "🔍 Diagnostics Complete"
echo "=========================================="
echo ""
echo "Would you like to apply the clean, minimal configuration? (y/n)"
read -r APPLY_FIX

if [ "$APPLY_FIX" != "y" ]; then
    echo "Exiting without applying fix."
    exit 0
fi

echo ""
echo "🔧 Applying clean minimal Ollama configuration..."
echo ""

# Backup current config
if [ -f "$NGINX_SITE_FILE" ]; then
    sudo cp "$NGINX_SITE_FILE" "$NGINX_SITE_FILE.backup-$(date +%Y%m%d-%H%M%S)"
    echo "✅ Backup created"
fi

# Write minimal, conflict-free configuration
sudo tee "$NGINX_SITE_FILE" > /dev/null <<'EOF'
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name ai.avs.ma;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ai.avs.ma;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/avs.ma/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/avs.ma/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # API endpoint - Proxy to Ollama
    location /api/ {
        proxy_pass http://127.0.0.1:11434/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Resilient proxy settings
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

    # Health check endpoint
    location = /api/version {
        proxy_pass http://127.0.0.1:11434/api/version;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        add_header Access-Control-Allow-Origin "*" always;
    }

    # Root location
    location / {
        return 404;
    }

    # Logs
    access_log /var/log/nginx/ollama-ai.access.log;
    error_log /var/log/nginx/ollama-ai.error.log;
}
EOF

echo "✅ Configuration written"

# Ensure the site is enabled
sudo ln -sf "$NGINX_SITE_FILE" "$NGINX_ENABLED_LINK"
echo "✅ Site enabled"

# Test configuration
echo "Testing Nginx configuration..."
if ! sudo nginx -t; then
    echo "❌ Nginx configuration test failed!"
    exit 1
fi
echo "✅ Nginx configuration is valid"

# Reload Nginx
echo "Reloading Nginx..."
sudo systemctl reload nginx
echo "✅ Nginx reloaded"

echo ""
echo "🧪 Testing fixed endpoints..."
echo ""

echo "Test 1: Local Ollama (http://127.0.0.1:11434/api/version):"
curl -sS -i http://127.0.0.1:11434/api/version | head -1
echo ""

echo "Test 2: HTTPS endpoint (https://ai.avs.ma/api/version):"
curl -sS -i https://ai.avs.ma/api/version | head -1
echo ""

echo "Test 3: Chat endpoint:"
curl -sS -i -X POST https://ai.avs.ma/api/chat \
  -H "Content-Type: application/json" \
  -d '{"model":"llama3.2:1b","messages":[{"role":"user","content":"hello"}],"stream":false}' \
  | head -1
echo ""

echo "📋 Recent access log:"
sudo tail -5 /var/log/nginx/ollama-ai.access.log
echo ""

echo "✅ Fix applied! Check the test results above."
echo "If you still see 403 errors, run: sudo tail -20 /var/log/nginx/ollama-ai.error.log"
