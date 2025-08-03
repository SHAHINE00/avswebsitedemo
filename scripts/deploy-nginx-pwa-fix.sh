#!/bin/bash

# Deploy corrected nginx configuration that blocks PWA files
# Run this on VPS to fix the PWA installation prompt issue

set -e

echo "🔧 Deploying corrected nginx configuration to block PWA files..."

VPS_PATH="/var/www/avswebsite"

# Step 1: Remove corrupted configuration
echo "📋 Removing corrupted nginx configuration..."
rm -f /etc/nginx/sites-enabled/avs.ma.conf
rm -f /etc/nginx/sites-available/avs.ma.conf

# Step 2: Copy corrected configuration
echo "📋 Installing corrected nginx configuration..."
cp ${VPS_PATH}/nginx-corrected.conf /etc/nginx/sites-available/avs.ma.conf

# Step 3: Enable the configuration
echo "📋 Enabling nginx configuration..."
ln -sf /etc/nginx/sites-available/avs.ma.conf /etc/nginx/sites-enabled/avs.ma.conf

# Step 4: Remove PWA files from file system
echo "📋 Removing PWA files from file system..."
rm -f ${VPS_PATH}/dist/manifest.json
rm -f ${VPS_PATH}/public/manifest.json
rm -f ${VPS_PATH}/dist/sw.js
rm -f ${VPS_PATH}/public/sw.js

# Step 5: Test nginx configuration
echo "📋 Testing nginx configuration..."
if ! nginx -t; then
    echo "❌ Nginx configuration test failed"
    exit 1
fi

# Step 6: Reload nginx
echo "🔄 Reloading nginx..."
nginx -s reload

# Step 7: Restart PM2
echo "🔄 Restarting PM2..."
pm2 restart education-platform
pm2 save

# Step 8: Verify the fix
echo "🧪 Verifying PWA files are blocked..."
sleep 2

echo "📋 Testing manifest.json (should return 404)..."
MANIFEST_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://avs.ma/manifest.json)
echo "manifest.json status: $MANIFEST_STATUS"

echo "📋 Testing sw.js (should return 404)..."
SW_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://avs.ma/sw.js)
echo "sw.js status: $SW_STATUS"

echo "📋 Testing main site (should return 200)..."
SITE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://avs.ma/)
echo "Main site status: $SITE_STATUS"

if [ "$MANIFEST_STATUS" = "404" ] && [ "$SW_STATUS" = "404" ] && [ "$SITE_STATUS" = "200" ]; then
    echo "✅ PWA fix deployed successfully!"
    echo "🎉 manifest.json and sw.js now return 404"
    echo "📱 Mobile install prompts should be eliminated"
else
    echo "❌ Fix verification failed"
    echo "Expected: manifest.json=404, sw.js=404, site=200"
    echo "Got: manifest.json=$MANIFEST_STATUS, sw.js=$SW_STATUS, site=$SITE_STATUS"
fi

echo ""
echo "🌐 Test the site now - PWA install prompts should be gone!"