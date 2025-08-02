#!/bin/bash

# Simple deployment script for AVS.ma website
# Run this from your local machine

set -e

echo "🚀 Starting simple deployment..."

# Step 1: Build locally
echo "🔨 Building application..."
npm install
npm run build

# Verify build exists
if [ ! -d "dist" ]; then
    echo "❌ Build failed - no dist folder found"
    exit 1
fi

echo "✅ Build completed successfully!"

# Step 2: Upload to VPS
echo "📤 Uploading to VPS..."
VPS_HOST="213.210.20.104"
VPS_USER="appuser"
VPS_PATH="/var/www/avswebsite"

# Upload dist files and nginx config
scp -r dist/* ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/dist/
scp nginx.conf ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/

echo "✅ Files uploaded successfully!"

# Step 3: Restart services on VPS
echo "🔄 Restarting services..."
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
cd /var/www/avswebsite

# Set correct permissions
sudo chown -R appuser:www-data dist/
sudo chmod -R 755 dist/

# Update nginx configuration 
sudo cp nginx.conf /etc/nginx/sites-available/avs.ma.conf
sudo ln -sf /etc/nginx/sites-available/avs.ma.conf /etc/nginx/sites-enabled/

# Test and reload nginx
if sudo nginx -t; then
    sudo systemctl reload nginx
    echo "✅ Nginx configuration updated and reloaded"
else
    echo "❌ Nginx configuration test failed"
    exit 1
fi

# Restart PM2 (using correct .cjs extension)
pm2 reload ecosystem.config.cjs --env production || pm2 start ecosystem.config.cjs --env production
pm2 save

echo "✅ Services restarted successfully!"
ENDSSH

# Step 4: Health check
echo "🏥 Running health check..."
sleep 5
curl -f https://avs.ma > /dev/null 2>&1 && echo "✅ Deployment successful!" || echo "❌ Health check failed"

echo "🎉 Deployment completed!"
echo "🌐 Your website should now be live at https://avs.ma"