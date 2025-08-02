#!/bin/bash

# Run the comprehensive mobile fix on the VPS
# This script connects to the VPS and runs the fix

set -e

echo "🚀 Running comprehensive mobile fix on VPS..."

VPS_HOST="213.210.20.104"
VPS_USER="root"
VPS_PATH="/var/www/avswebsite"

# Upload the fix script and run it on the VPS
echo "📤 Uploading fix script to VPS..."
scp scripts/comprehensive-mobile-fix.sh ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/

echo "🔧 Running comprehensive fix on VPS..."
ssh ${VPS_USER}@${VPS_HOST} << ENDSSH
cd ${VPS_PATH}
chmod +x comprehensive-mobile-fix.sh
./comprehensive-mobile-fix.sh
ENDSSH

echo "✅ Comprehensive mobile fix completed!"
echo "🌐 Test the website now: https://avs.ma"