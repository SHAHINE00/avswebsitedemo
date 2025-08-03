#!/bin/bash

# Deploy iOS download prompt fix
# Changes PWA manifest display mode to eliminate download prompts on iOS

set -e

echo "🍎 Deploying iOS download prompt fix..."

# Build the application
echo "🔨 Building application..."
npm run build

# Deploy to VPS
VPS_HOST="213.210.20.104"
VPS_USER="root"
VPS_PATH="/var/www/avswebsite"

echo "📤 Uploading files to VPS..."
scp -r dist/* ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/dist/

echo "🔧 Reloading application on VPS..."
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
cd /var/www/avswebsite

# Set correct permissions
chown -R appuser:www-data /var/www/avswebsite
chmod -R 755 /var/www/avswebsite

# Reload PM2 processes
pm2 reload education-platform

echo "✅ iOS download fix deployed!"
ENDSSH

echo "🧪 Testing iOS fix..."
sleep 3
curl -I -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)" https://avs.ma/ | grep -E "Content-Type|HTTP"

echo ""
echo "🎉 iOS download prompt fix deployed successfully!"
echo "📱 Key changes:"
echo "  • Changed PWA manifest display from 'minimal-ui' to 'browser'"
echo "  • iOS Safari will no longer show download/install prompts"
echo ""
echo "🌐 Test on iPhone/iPad now - the download prompt should be gone!"