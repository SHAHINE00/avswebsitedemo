#!/bin/bash

# Fix nginx configuration conflict for mobile download issue
# This script removes conflicting default configuration and applies the mobile fix

set -e

echo "🔧 Fixing nginx configuration conflict..."

# Step 1: Remove the conflicting default configuration
echo "📋 Removing conflicting default.conf..."
rm -f /etc/nginx/sites-enabled/default.conf

# Step 2: Verify only our configuration is active
echo "📋 Checking active configurations..."
ls -la /etc/nginx/sites-enabled/

# Step 3: Ensure our configuration is properly linked
echo "📋 Ensuring avs.ma.conf is properly enabled..."
ln -sf /etc/nginx/sites-available/avs.ma.conf /etc/nginx/sites-enabled/avs.ma.conf

# Step 4: Test nginx configuration
echo "📋 Testing nginx configuration..."
if ! nginx -t; then
    echo "❌ Nginx configuration test failed"
    exit 1
fi

# Step 5: Force nginx to fully restart (not just reload)
echo "🔄 Restarting nginx..."
systemctl restart nginx

# Step 6: Set correct permissions
echo "📋 Setting correct permissions..."
chown -R appuser:www-data /var/www/avswebsite
chmod -R 755 /var/www/avswebsite

# Step 7: Test the headers
echo "🧪 Testing headers..."
sleep 2

echo "📋 Testing standard headers..."
curl -s -I https://avs.ma/ | grep -i "content-type\|x-debug" || echo "No Content-Type or X-Debug headers found"

echo "📋 Testing mobile user agent headers..."
curl -s -I -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" https://avs.ma/ | grep -i "content-type\|x-debug" || echo "No Content-Type or X-Debug headers found for mobile"

echo "📋 Full header check..."
curl -s -I https://avs.ma/ | head -15

echo "✅ Nginx configuration conflict fix completed!"
echo "🌐 The mobile download issue should now be resolved. Test on mobile devices."