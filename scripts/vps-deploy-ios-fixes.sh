#!/bin/bash

# VPS iOS Deployment Script
# Run this script on your VPS to deploy iOS dropdown fixes

set -e

echo "🍎 Deploying iOS Safari dropdown fixes on VPS..."

# Ensure we're in the right directory
cd /var/www/avswebsite

# Install express if not available
if ! npm list express > /dev/null 2>&1; then
    echo "📦 Installing express for serving..."
    npm install express
fi

# Stop PM2 process
echo "🛑 Stopping PM2 process..."
pm2 stop education-platform || true

# Clear PM2 logs and cache
echo "🧹 Clearing PM2 logs and cache..."
pm2 flush
pm2 delete education-platform || true

# Clean and rebuild
echo "🔨 Building application with iOS fixes..."
rm -rf dist/
npm cache clean --force
npm run build

# Verify build
if [ ! -f "dist/index.html" ]; then
    echo "❌ Build failed - no index.html found"
    exit 1
fi

echo "✅ Build completed successfully!"

# Start PM2 with new configuration
echo "🚀 Starting PM2 with updated configuration..."
pm2 start ecosystem.config.cjs --env production

# Show status
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "✅ iOS dropdown fixes deployed successfully!"
echo "🔍 Key fixes included:"
echo "   • iOS touch event handling"
echo "   • Safari-specific CSS optimizations" 
echo "   • Enhanced z-index management"
echo "   • Proper touch targets for mobile"
echo ""
echo "📱 Test the dropdowns on iOS devices now!"