#!/bin/bash

# Deploy and run the 403 diagnostic script on VPS
set -e

echo "🚀 Deploying 403 diagnostic script to VPS..."

VPS_HOST="213.210.20.104"
VPS_USER="root"

# Upload the diagnostic script
echo "📤 Uploading diagnostic script..."
scp scripts/diagnose-403-source.sh ${VPS_USER}@${VPS_HOST}:/root/

# Run it on VPS
echo "🔍 Running diagnostic on VPS..."
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
cd /root
chmod +x diagnose-403-source.sh
./diagnose-403-source.sh
ENDSSH

echo ""
echo "✅ Diagnostic complete! Check output above for the 403 source."
