#!/bin/bash

# Deploy the nginx configuration fix to VPS
# Run this from your local machine to fix the mobile download issue

set -e

echo "🚀 Deploying nginx configuration fix to VPS..."

VPS_HOST="213.210.20.104"
VPS_USER="root"
VPS_PATH="/var/www/avswebsite"

# Upload the fix script to VPS
echo "📤 Uploading nginx fix script..."
scp scripts/fix-nginx-conflict.sh ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/

# Run the fix on VPS
echo "🔧 Running nginx configuration fix on VPS..."
ssh ${VPS_USER}@${VPS_HOST} << ENDSSH
cd ${VPS_PATH}
chmod +x fix-nginx-conflict.sh
./fix-nginx-conflict.sh
ENDSSH

echo "✅ Nginx configuration fix deployed successfully!"
echo "🌐 Mobile download issue should now be resolved. Test at: https://avs.ma"