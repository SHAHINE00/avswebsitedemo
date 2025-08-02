#!/bin/bash

# Apply PWA and nginx fixes to eliminate mobile download prompts
set -e

echo "🚀 Applying PWA and nginx fixes to eliminate mobile download prompts..."

# Check if we're on the VPS
if [ ! -d "/var/www" ]; then
    echo "❌ Not on VPS server. This script should be run on the server."
    exit 1
fi

# Find the correct website directory
WEBSITE_DIR=""
for dir in /var/www/*/; do
    if [ -d "$dir" ] && [ -f "${dir}dist/index.html" ]; then
        WEBSITE_DIR="$dir"
        break
    fi
done

if [ -z "$WEBSITE_DIR" ]; then
    echo "❌ Could not find website directory with dist/index.html"
    exit 1
fi

echo "📁 Found website directory: $WEBSITE_DIR"

# Backup current files
echo "💾 Creating backups..."
[ -f "${WEBSITE_DIR}dist/manifest.json" ] && cp "${WEBSITE_DIR}dist/manifest.json" "${WEBSITE_DIR}dist/manifest.json.bak"
[ -f "${WEBSITE_DIR}dist/index.html" ] && cp "${WEBSITE_DIR}dist/index.html" "${WEBSITE_DIR}dist/index.html.bak"

# Update manifest.json to disable PWA behavior
echo "📝 Updating manifest.json..."
cp manifest-fix.json "${WEBSITE_DIR}dist/manifest.json"

# Update index.html to remove PWA meta tags
echo "📝 Updating index.html..."
sed -i '/<meta name="apple-mobile-web-app-capable"/d' "${WEBSITE_DIR}dist/index.html"
sed -i '/<meta name="mobile-web-app-capable"/d' "${WEBSITE_DIR}dist/index.html"
sed -i '/<meta name="apple-mobile-web-app-status-bar-style"/d' "${WEBSITE_DIR}dist/index.html"

# Update nginx configuration
echo "🔧 Updating nginx configuration..."
cp nginx-pwa-fix.conf /etc/nginx/sites-available/avs.ma.conf

# Remove conflicting configurations
rm -f /etc/nginx/sites-enabled/default.conf
rm -f /etc/nginx/sites-enabled/default

# Enable our configuration
ln -sf /etc/nginx/sites-available/avs.ma.conf /etc/nginx/sites-enabled/avs.ma.conf

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
if ! nginx -t; then
    echo "❌ Nginx configuration test failed"
    exit 1
fi

# Restart nginx
echo "🔄 Restarting nginx..."
systemctl restart nginx

# Set correct permissions
echo "🔐 Setting correct permissions..."
chown -R www-data:www-data "${WEBSITE_DIR}"
chmod -R 755 "${WEBSITE_DIR}"

# Test the fixes
echo "🧪 Testing fixes..."
sleep 2
echo "Testing regular headers:"
curl -s -I https://avs.ma/ | head -5

echo -e "\nTesting mobile user agent:"
curl -s -I -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" https://avs.ma/ | head -5

echo -e "\n✅ PWA and nginx fixes applied successfully!"
echo "🌐 Mobile download prompts should now be eliminated."
echo "📱 Changes made:"
echo "  - PWA manifest display changed from 'standalone' to 'browser'"
echo "  - Removed apple-mobile-web-app-capable and mobile-web-app-capable meta tags"
echo "  - Updated nginx to use proper MIME type detection"
echo "  - Removed custom Content-Type headers"