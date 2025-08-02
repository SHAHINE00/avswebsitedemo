#!/bin/bash

# Quick mobile fix deployment
# This script quickly deploys the mobile download fix

set -e

echo "🚀 Quick mobile fix deployment..."

# Build locally
echo "🔨 Building..."
npm run build

# Deploy to VPS
VPS_HOST="213.210.20.104"
VPS_USER="root"

echo "📤 Uploading files..."
scp -r dist/* ${VPS_USER}@${VPS_HOST}:/var/www/avswebsite/dist/
scp nginx.conf ${VPS_USER}@${VPS_HOST}:/var/www/avswebsite/

echo "🔧 Updating server configuration..."
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
cd /var/www/avswebsite

# Update nginx configuration
cp nginx.conf /etc/nginx/sites-available/avs.ma.conf
ln -sf /etc/nginx/sites-available/avs.ma.conf /etc/nginx/sites-enabled/

# Test nginx configuration
if nginx -t; then
    systemctl reload nginx
    echo "✅ Nginx reloaded"
else
    echo "❌ Nginx test failed"
    exit 1
fi

# Set permissions
chown -R appuser:www-data /var/www/avswebsite
chmod -R 755 /var/www/avswebsite

echo "✅ Mobile fix deployed!"
ENDSSH

echo "🏥 Testing..."
sleep 3
curl -I https://avs.ma/ | grep -E "Content-Type|X-Debug"

echo "🎉 Mobile download fix deployed and tested!"