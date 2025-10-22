#!/bin/bash

# Fix Ollama Nginx 403 Forbidden error
# This script updates the Nginx configuration to allow API requests

set -e

echo "🔧 Fixing Ollama Nginx 403 Forbidden error..."

# Define paths
NGINX_CONFIG="/etc/nginx/sites-available/ai.avs.ma.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/ai.avs.ma.conf"
BACKUP_CONFIG="/etc/nginx/sites-available/ai.avs.ma.conf.backup-$(date +%Y%m%d-%H%M%S)"

# Step 1: Backup current configuration
echo "📋 Backing up current Nginx configuration..."
cp "$NGINX_CONFIG" "$BACKUP_CONFIG"
echo "✅ Backup saved to: $BACKUP_CONFIG"

# Step 2: Upload and replace the fixed configuration
echo "📤 Updating Nginx configuration..."
cat > "$NGINX_CONFIG" << 'EOF'
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

    # Block sensitive files at server level
    location ~ /\.(ht|git|env) {
        deny all;
        return 404;
    }

    # Block common attack patterns at server level
    location ~ (\.sql|wp-admin|phpmyadmin) {
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

# Step 3: Ensure symlink exists
echo "📋 Ensuring Nginx site is enabled..."
ln -sf "$NGINX_CONFIG" "$NGINX_ENABLED"

# Step 4: Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
if ! nginx -t; then
    echo "❌ Nginx configuration test failed! Restoring backup..."
    cp "$BACKUP_CONFIG" "$NGINX_CONFIG"
    nginx -t
    exit 1
fi

# Step 5: Reload Nginx
echo "🔄 Reloading Nginx..."
systemctl reload nginx

# Step 6: Wait a moment for Nginx to reload
sleep 2

# Step 7: Test the endpoints
echo ""
echo "🧪 Testing endpoints..."
echo "📋 Testing /api/version:"
curl -s https://ai.avs.ma/api/version || echo "❌ Failed"

echo ""
echo "📋 Testing /api/chat with simple request:"
curl -s -X POST https://ai.avs.ma/api/chat \
  -H "Content-Type: application/json" \
  -d '{"model": "llama3.2:1b", "messages": [{"role": "user", "content": "Hi"}], "stream": false}' \
  | head -c 200 || echo "❌ Failed"

echo ""
echo ""
echo "✅ Nginx configuration fix completed!"
echo "🌐 Ollama API should now be accessible at https://ai.avs.ma/api/"
echo ""
echo "📋 If you still see issues, check the logs:"
echo "   sudo tail -20 /var/log/nginx/ollama-ai.error.log"
echo "   sudo tail -20 /var/log/nginx/ollama-ai.access.log"
