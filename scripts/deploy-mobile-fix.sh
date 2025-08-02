#!/bin/bash

# Deploy mobile fix to production
# This script deploys the nginx and server.cjs fixes for mobile devices

set -e

echo "🚀 Deploying mobile download fix..."

# Build the application with fixes
echo "🔨 Building application..."
npm run build

# Upload and deploy to VPS
echo "📤 Deploying to VPS..."
VPS_HOST="213.210.20.104"
VPS_USER="root"
VPS_PATH="/var/www/avswebsite"

# Upload updated files
scp nginx.conf ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp server.cjs ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp -r dist/* ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/dist/

# Deploy on server
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
cd /var/www/avswebsite

# Update nginx configuration
cp nginx.conf /etc/nginx/sites-available/avs.ma.conf
ln -sf /etc/nginx/sites-available/avs.ma.conf /etc/nginx/sites-enabled/

# Test and reload nginx
if nginx -t; then
    systemctl reload nginx
    echo "✅ Nginx reloaded successfully"
else
    echo "❌ Nginx configuration test failed"
    exit 1
fi

# Set permissions
chown -R appuser:www-data /var/www/avswebsite
chmod -R 755 /var/www/avswebsite

# Restart Node.js server with PM2
pm2 reload ecosystem.config.cjs --env production || pm2 start ecosystem.config.cjs --env production
pm2 save

echo "✅ Mobile fix deployed successfully!"
ENDSSH

# Health check
echo "🏥 Testing mobile fix..."
sleep 5
curl -f https://avs.ma > /dev/null 2>&1 && echo "✅ Website is accessible!" || echo "❌ Health check failed"

echo "🎉 Mobile download fix deployed! Test on your mobile devices now."