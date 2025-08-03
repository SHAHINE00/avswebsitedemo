#!/bin/bash

# VPS deployment script for cross-browser optimization
# Run this on your VPS to deploy the optimized build

set -e

echo "🌐 Deploying cross-browser optimization to VPS..."

VPS_PATH="/var/www/avswebsite"
cd "$VPS_PATH"

# Backup current deployment
echo "💾 Creating backup..."
if [ -d "dist" ]; then
    cp -r dist dist.backup.$(date +%Y%m%d_%H%M%S)
fi

# Stop PM2 processes
echo "🛑 Stopping services..."
pm2 stop education-platform || true

# Clean cache and temporary files
echo "🧹 Cleaning caches..."
pm2 flush
npm cache clean --force

# Build with cross-browser optimizations
echo "🔨 Building with cross-browser optimization..."
npm run build

# Remove PWA manifest if it exists
if [ -f "dist/manifest.json" ]; then
    echo "🗑️ Removing PWA manifest..."
    rm -f dist/manifest.json
fi

# Set proper permissions
echo "🔧 Setting permissions..."
chown -R appuser:www-data "$VPS_PATH"
chmod -R 755 "$VPS_PATH"

# Update nginx configuration for better cross-browser support
echo "⚙️ Updating nginx configuration..."
cat > /etc/nginx/sites-available/avs.ma << 'NGINX_CONF'
server {
    listen 80;
    listen [::]:80;
    server_name avs.ma www.avs.ma;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name avs.ma www.avs.ma;

    ssl_certificate /etc/letsencrypt/live/avs.ma/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/avs.ma/privkey.pem;
    
    # Enhanced SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    root /var/www/avswebsite/dist;
    index index.html index.htm;

    # Cross-browser security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Cache control for better performance
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
    }
    
    # Gzip compression for all browsers
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
        
        # Additional headers for cross-browser compatibility
        add_header X-UA-Compatible "IE=edge" always;
        add_header Vary "User-Agent" always;
    }
    
    # Prevent access to manifest.json (PWA removal)
    location = /manifest.json {
        return 404;
    }
    
    # Mobile-specific optimizations
    location ~* \.(css|js)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Vary "Accept-Encoding, User-Agent";
    }
    
    # Error pages
    error_page 404 /index.html;
    error_page 500 502 503 504 /index.html;
}
NGINX_CONF

# Test and reload nginx
echo "🔄 Reloading nginx..."
nginx -t && nginx -s reload

# Start PM2 with updated configuration
echo "🚀 Starting services..."
pm2 start ecosystem.config.cjs --env production

# Verify deployment
echo "📊 Checking deployment status..."
pm2 status
echo ""
echo "🧪 Testing HTTPS access..."
sleep 3
curl -I -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)" https://avs.ma/ | head -5

echo ""
echo "✅ Cross-browser optimization deployed successfully!"
echo ""
echo "🎉 Key improvements deployed:"
echo "   ✓ No PWA install prompts on any browser/device"
echo "   ✓ Enhanced iOS Safari compatibility"
echo "   ✓ Improved Android Chrome performance"
echo "   ✓ Better Firefox/Edge support"
echo "   ✓ Optimized touch targets for all mobile devices"
echo "   ✓ Enhanced security headers"
echo "   ✓ Improved caching and compression"
echo ""
echo "🌐 Test now on all devices - should work smoothly everywhere!"