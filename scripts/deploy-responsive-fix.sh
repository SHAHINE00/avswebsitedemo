#!/bin/bash

# Complete responsive and download fix
# Fixes all mobile/desktop issues and improves responsiveness

set -e

echo "🚀 Deploying complete responsive and download fix..."

# Build with all fixes
echo "🔨 Building with comprehensive fixes..."
npm run build

# Deploy to VPS
VPS_HOST="213.210.20.104"
VPS_USER="root"
VPS_PATH="/var/www/avswebsite"

echo "📤 Uploading files to VPS..."
scp nginx.conf ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp server.cjs ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp -r dist/* ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/dist/

echo "🔧 Applying comprehensive fixes on VPS..."
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
cd /var/www/avswebsite

# Update nginx configuration
cp nginx.conf /etc/nginx/sites-available/avs.ma.conf

# Remove ALL conflicting configurations
rm -f /etc/nginx/sites-enabled/default*
rm -f /etc/nginx/sites-available/default*

# Ensure ONLY our configuration is enabled
ln -sf /etc/nginx/sites-available/avs.ma.conf /etc/nginx/sites-enabled/

# Test nginx configuration
if nginx -t; then
    # Force restart nginx to clear all cached headers
    systemctl stop nginx
    sleep 2
    systemctl start nginx
    echo "✅ Nginx restarted successfully"
else
    echo "❌ Nginx configuration test failed"
    exit 1
fi

# Update PM2 server with proper MIME types
pm2 reload ecosystem.config.cjs --env production || pm2 start ecosystem.config.cjs --env production
pm2 save

# Set correct permissions
chown -R appuser:www-data /var/www/avswebsite
chmod -R 755 /var/www/avswebsite

echo "✅ Comprehensive fix deployed successfully!"
ENDSSH

echo "🧪 Testing comprehensive fix..."
sleep 5

echo "📱 Testing mobile headers..."
curl -I -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)" https://avs.ma/ | head -10

echo ""
echo "💻 Testing desktop headers..."
curl -I -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" https://avs.ma/ | head -10

echo ""
echo "🎉 Complete responsive and download fix deployed!"
echo ""
echo "📋 Changes made:"
echo "  ✅ Fixed server.cjs MIME type defaults (no more HTML fallback)"
echo "  ✅ Cleaned nginx configuration (removed all Content-Type conflicts)"  
echo "  ✅ Force-restarted nginx to clear cached headers"
echo "  ✅ Updated PWA manifest for better mobile experience"
echo "  ✅ Simplified mobile detection hooks"
echo "  ✅ Enhanced responsive design system"
echo "  ✅ Improved breakpoint consistency"
echo ""
echo "🌐 Both mobile and desktop download notifications should now be eliminated!"
echo "📱 All devices should now have consistent responsive behavior!"