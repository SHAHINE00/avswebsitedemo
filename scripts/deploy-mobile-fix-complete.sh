#!/bin/bash

# Complete mobile fix deployment
# Fixes download notification and responsiveness issues

set -e

echo "🚀 Deploying complete mobile fix..."

# Build with fixes
echo "🔨 Building with mobile fixes..."
npm run build

# Deploy to VPS
VPS_HOST="213.210.20.104"
VPS_USER="root"
VPS_PATH="/var/www/avswebsite"

echo "📤 Uploading files to VPS..."
scp nginx.conf ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp -r dist/* ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/dist/

echo "🔧 Applying fixes on VPS..."
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
cd /var/www/avswebsite

# Update nginx configuration
cp nginx.conf /etc/nginx/sites-available/avs.ma.conf

# Remove any conflicting configurations
rm -f /etc/nginx/sites-enabled/default*

# Ensure our configuration is enabled
ln -sf /etc/nginx/sites-available/avs.ma.conf /etc/nginx/sites-enabled/

# Test nginx configuration
if nginx -t; then
    systemctl restart nginx
    echo "✅ Nginx restarted successfully"
else
    echo "❌ Nginx configuration test failed"
    exit 1
fi

# Set correct permissions
chown -R appuser:www-data /var/www/avswebsite
chmod -R 755 /var/www/avswebsite

echo "✅ Mobile fix deployed successfully!"
ENDSSH

echo "🧪 Testing mobile fix..."
sleep 3

echo "📱 Testing mobile headers..."
curl -I -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)" https://avs.ma/ | grep -E "Content-Type|HTTP"

echo ""
echo "🎉 Complete mobile fix deployed!"
echo ""
echo "📋 Changes made:"
echo "  ✅ Removed conflicting Content-Type headers from nginx"
echo "  ✅ Simplified PWA manifest (minimal-ui instead of browser)"
echo "  ✅ Removed apple-mobile-web-app-capable tags"
echo "  ✅ Added automatic cache clearing for mobile devices"
echo "  ✅ Simplified mobile detection hooks"
echo "  ✅ Fixed HTTP to HTTPS redirect"
echo ""
echo "🌐 Test on mobile devices now - download notification should be gone!"