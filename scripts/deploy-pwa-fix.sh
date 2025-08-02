#!/bin/bash

# Deploy PWA and nginx fixes to eliminate mobile download prompts
# Run this from your local machine

set -e

echo "🚀 Deploying PWA and nginx fixes to eliminate mobile download prompts..."

VPS_HOST="213.210.20.104"
VPS_USER="root"
VPS_PATH="/var/www/avswebsite"

# Upload the nginx configuration
echo "📤 Uploading nginx configuration fix..."
scp nginx-fix.conf ${VPS_USER}@${VPS_HOST}:/etc/nginx/sites-available/avs.ma.conf

# Upload the current build with PWA fixes
echo "📤 Uploading updated build with PWA fixes..."
npm run build
scp -r dist/* ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/dist/

# Apply fixes on VPS
echo "🔧 Applying fixes on VPS..."
ssh ${VPS_USER}@${VPS_HOST} << ENDSSH
# Remove any conflicting configurations
rm -f /etc/nginx/sites-enabled/default.conf
rm -f /etc/nginx/sites-enabled/default

# Ensure our configuration is enabled
ln -sf /etc/nginx/sites-available/avs.ma.conf /etc/nginx/sites-enabled/avs.ma.conf

# Test nginx configuration
if ! nginx -t; then
    echo "❌ Nginx configuration test failed"
    exit 1
fi

# Restart nginx to clear any cached headers
systemctl restart nginx

# Set correct permissions
chown -R appuser:www-data ${VPS_PATH}
chmod -R 755 ${VPS_PATH}

echo "🧪 Testing headers after fix..."
sleep 2
curl -s -I https://avs.ma/ | head -10

echo "🧪 Testing mobile user agent..."
curl -s -I -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" https://avs.ma/ | head -10
ENDSSH

echo "✅ PWA and nginx fixes deployed successfully!"
echo "🌐 Mobile download prompts should now be eliminated. Test on mobile devices."
echo ""
echo "📱 Changes made:"
echo "  - PWA manifest display changed from 'standalone' to 'browser'"
echo "  - Removed apple-mobile-web-app-capable and mobile-web-app-capable"
echo "  - Updated nginx to use proper MIME type detection"
echo "  - Removed custom Content-Type headers that were causing conflicts"