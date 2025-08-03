#!/bin/bash

# Deploy monitoring system to VPS
# This script uploads and configures all monitoring components

set -e

VPS_HOST="213.210.20.104"
VPS_USER="root"
VPS_PATH="/var/www/avswebsite"

echo "🚀 Deploying monitoring system to VPS..."

# Upload monitoring scripts to VPS
echo "📤 Uploading monitoring scripts..."
scp scripts/setup-monitoring.sh ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/scripts/
scp scripts/maintenance.sh ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/scripts/
scp scripts/verify-setup.sh ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/scripts/
scp scripts/quick-status.sh ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/scripts/

# Connect to VPS and set up monitoring
echo "🔧 Setting up monitoring on VPS..."
ssh ${VPS_USER}@${VPS_HOST} << ENDSSH
cd ${VPS_PATH}

# Make scripts executable
chmod +x scripts/*.sh

# Install required packages
apt-get update
apt-get install -y bc curl

# Run monitoring setup
echo "📊 Running monitoring setup..."
./scripts/setup-monitoring.sh

# Test monitoring scripts
echo "🧪 Testing monitoring scripts..."
/usr/local/bin/check-website.sh
/usr/local/bin/check-performance.sh

# Run initial status check
echo "✅ Running initial status verification..."
./scripts/verify-setup.sh

echo "🎉 Monitoring system deployed successfully!"
ENDSSH

echo "✅ Monitoring deployment completed!"
echo "📊 Monitoring logs: /var/log/monitoring/"
echo "🔔 Alerts viewable with: journalctl -t website-monitor -t performance-monitor"
echo "⏰ Automatic maintenance runs every Sunday at 2 AM"
echo ""
echo "🔧 Run './scripts/quick-status.sh' anytime for a quick health check"