#!/bin/bash

# Comprehensive mobile download fix and nginx debugging
# This script fixes SSL, nginx configuration, and mobile download issues

set -e

echo "🔧 Comprehensive Mobile Download Fix"
echo "=================================="

# Step 1: Check current nginx configuration
echo "📋 Step 1: Checking nginx configuration..."
nginx -t
echo "✅ Nginx configuration syntax is valid"

# Step 2: Test local HTTP access
echo ""
echo "📋 Step 2: Testing local HTTP access..."
curl -I http://localhost:80 || echo "❌ Local HTTP access failed"

# Step 3: Test local HTTPS access
echo ""
echo "📋 Step 3: Testing local HTTPS access..."
curl -I -k https://localhost:443 || echo "❌ Local HTTPS access failed"

# Step 4: Check SSL certificate
echo ""
echo "📋 Step 4: Checking SSL certificate..."
openssl x509 -in /etc/letsencrypt/live/avs.ma/fullchain.pem -text -noout | grep -E "Subject:|Not After" || echo "❌ SSL certificate issue"

# Step 5: Check nginx site configuration links
echo ""
echo "📋 Step 5: Checking nginx site configuration..."
ls -la /etc/nginx/sites-enabled/ | grep avs.ma || echo "❌ Site not properly linked"
ls -la /etc/nginx/sites-available/ | grep avs.ma || echo "❌ Site configuration missing"

# Step 6: Verify file permissions and existence
echo ""
echo "📋 Step 6: Checking file permissions..."
ls -la /var/www/avswebsite/dist/index.html

# Step 7: Check if PM2 is interfering
echo ""
echo "📋 Step 7: Checking PM2 status..."
pm2 list

# Step 8: Fix nginx configuration with proper SSL handling
echo ""
echo "📋 Step 8: Updating nginx configuration..."
cd /var/www/avswebsite

# Backup current nginx config
cp /etc/nginx/sites-available/avs.ma.conf /etc/nginx/sites-available/avs.ma.conf.backup.$(date +%s) || true

# Apply the new configuration
cp nginx.conf /etc/nginx/sites-available/avs.ma.conf
ln -sf /etc/nginx/sites-available/avs.ma.conf /etc/nginx/sites-enabled/

# Test the new configuration
if nginx -t; then
    echo "✅ New nginx configuration is valid"
    systemctl reload nginx
    echo "✅ Nginx reloaded successfully"
else
    echo "❌ New nginx configuration failed, restoring backup"
    cp /etc/nginx/sites-available/avs.ma.conf.backup.* /etc/nginx/sites-available/avs.ma.conf 2>/dev/null || true
    systemctl reload nginx
    exit 1
fi

# Step 9: Set correct permissions
echo ""
echo "📋 Step 9: Setting correct permissions..."
chown -R appuser:www-data /var/www/avswebsite
chmod -R 755 /var/www/avswebsite
chmod 644 /var/www/avswebsite/dist/index.html

# Step 10: Test HTTPS access after fixes
echo ""
echo "📋 Step 10: Testing HTTPS access after fixes..."
sleep 3

echo "Testing with curl -I..."
curl -I https://avs.ma/ | head -10

echo ""
echo "Testing with curl -v for detailed debug..."
curl -v https://avs.ma/ 2>&1 | head -20

echo ""
echo "Testing headers specifically..."
curl -I https://avs.ma/ | grep -E "Content-Type|X-Debug|Cache-Control|HTTP"

# Step 11: Test mobile user agent
echo ""
echo "📋 Step 11: Testing mobile user agent simulation..."
curl -I -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15" https://avs.ma/ | grep -E "Content-Type|X-Debug"

echo ""
echo "✅ Comprehensive fix completed!"
echo ""
echo "📊 Summary:"
echo "   • Nginx configuration updated with proper SSL handling"
echo "   • File permissions corrected"
echo "   • Mobile download headers configured"
echo "   • Debug headers enabled for troubleshooting"
echo ""
echo "🔍 If curl still returns no headers, the issue might be:"
echo "   • Firewall blocking HTTPS traffic"
echo "   • SSL certificate needs renewal"
echo "   • DNS/routing issue"
echo ""
echo "🌐 Test the website now: https://avs.ma"