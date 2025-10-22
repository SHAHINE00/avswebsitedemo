#!/bin/bash

# Deploy corrected Ollama Nginx configuration to VPS
# This script applies the fix that removes the problematic if block causing 403 errors

set -e

echo "🔧 Deploying Ollama Nginx configuration fix..."

# Configuration variables
NGINX_SITE_FILE="/etc/nginx/sites-available/ai.avs.ma.conf"
NGINX_ENABLED_LINK="/etc/nginx/sites-enabled/ai.avs.ma.conf"

# Step 1: Verify Ollama is running locally
echo "📋 Step 1: Verifying Ollama is running..."
if ! curl -sS http://127.0.0.1:11434/api/version > /dev/null 2>&1; then
    echo "❌ ERROR: Ollama is not responding on http://127.0.0.1:11434"
    echo "Please ensure Ollama is running with: sudo systemctl status ollama"
    exit 1
fi
echo "✅ Ollama is running locally"

# Step 2: Backup current configuration
echo "📋 Step 2: Backing up current configuration..."
if [ -f "$NGINX_SITE_FILE" ]; then
    sudo cp "$NGINX_SITE_FILE" "$NGINX_SITE_FILE.backup-$(date +%Y%m%d-%H%M%S)"
    echo "✅ Backup created"
else
    echo "⚠️  No existing configuration found at $NGINX_SITE_FILE"
fi

# Step 3: Write the corrected configuration
echo "📋 Step 3: Writing corrected Nginx configuration..."
sudo tee "$NGINX_SITE_FILE" > /dev/null <<'EOF'
# Rate limiting zone definition
limit_req_zone $binary_remote_addr zone=ollama_limit:10m rate=10r/m;

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name ai.avs.ma;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name ai.avs.ma;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/avs.ma/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/avs.ma/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Block sensitive files BEFORE /api/ location
    location ~ /\.(ht|git|env) {
        deny all;
        return 404;
    }

    # API endpoint - Proxy to Ollama with resilient settings
    location /api/ {
        # Rate limiting
        limit_req zone=ollama_limit burst=20 nodelay;
        
        # Proxy to Ollama
        proxy_pass http://127.0.0.1:11434/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Resilient proxy settings for AI responses
        proxy_buffering off;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
        proxy_connect_timeout 60s;
        client_max_body_size 10m;
        
        # Cache control
        add_header Cache-Control "no-cache" always;
        
        # Allow CORS for your app
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
        
        if ($request_method = OPTIONS) {
            return 204;
        }
    }

    # Health check endpoint
    location /api/version {
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

# Step 4: Ensure the site is enabled
echo "📋 Step 4: Enabling site..."
sudo ln -sf "$NGINX_SITE_FILE" "$NGINX_ENABLED_LINK"
echo "✅ Site enabled"

# Step 5: Test Nginx configuration
echo "📋 Step 5: Testing Nginx configuration..."
if ! sudo nginx -t; then
    echo "❌ Nginx configuration test failed!"
    echo "Restoring backup..."
    if [ -f "$NGINX_SITE_FILE.backup-"* ]; then
        sudo cp "$NGINX_SITE_FILE.backup-"* "$NGINX_SITE_FILE"
        sudo nginx -t
    fi
    exit 1
fi
echo "✅ Nginx configuration is valid"

# Step 6: Reload Nginx
echo "📋 Step 6: Reloading Nginx..."
sudo systemctl reload nginx
echo "✅ Nginx reloaded"

# Step 7: Test endpoints
echo ""
echo "🧪 Testing endpoints..."
echo ""

echo "Test 1: Local Ollama (http://127.0.0.1:11434/api/version):"
curl -sS -i http://127.0.0.1:11434/api/version | head -1
echo ""

echo "Test 2: HTTPS endpoint (https://ai.avs.ma/api/version):"
curl -sS -i https://ai.avs.ma/api/version | head -1
echo ""

echo "Test 3: Chat endpoint (POST https://ai.avs.ma/api/chat):"
curl -sS -i -X POST https://ai.avs.ma/api/chat \
  -H "Content-Type: application/json" \
  -d '{"model":"llama3.2:1b","messages":[{"role":"user","content":"hello"}],"stream":false}' \
  | head -1
echo ""

echo "📋 Recent access log entries:"
sudo tail -5 /var/log/nginx/ollama-ai.access.log
echo ""

echo "✅ Deployment complete!"
echo "🌐 Your Ollama API should now be accessible at https://ai.avs.ma/api/"
echo ""
echo "If you still see 403 errors, check:"
echo "  1. sudo tail -20 /var/log/nginx/ollama-ai.error.log"
echo "  2. sudo nginx -T | grep -A 30 'server_name ai.avs.ma'"
