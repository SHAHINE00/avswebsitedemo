#!/bin/bash

# iOS Dropdown Fixes Deployment Script
# Deploys the comprehensive iOS Safari dropdown fixes to production

set -e

echo "🍎 Deploying iOS Safari dropdown fixes to production..."

# Set environment
export NODE_ENV=production

echo "🧹 Cleaning previous builds..."
rm -rf dist/
npm cache clean --force

echo "📦 Installing dependencies..."
npm ci --production=false

echo "🔨 Building application with iOS fixes..."
npm run build

# Verify critical files exist
if [ ! -f "dist/index.html" ]; then
    echo "❌ Build failed - no index.html found"
    exit 1
fi

echo "✅ iOS Safari fixes built successfully!"
echo "📱 Key improvements included:"
echo "   • iOS-specific touch event handling for dropdowns"
echo "   • Enhanced Select component with iOS detection"
echo "   • Proper touch targets (44px minimum for iOS)"
echo "   • Safari-specific CSS optimizations"
echo "   • Touch action control to prevent scroll conflicts"
echo "   • Higher z-index for better dropdown layering"
echo ""
echo "🎯 The dropdown 'open and close immediately' issue on iOS should now be resolved"
echo ""
echo "📊 Build verification:"
ls -la dist/ | head -10
echo ""
echo "🚀 Ready for VPS deployment!"
echo "📋 Next steps:"
echo "   1. Copy the dist/ folder to your VPS"
echo "   2. Restart PM2: pm2 restart education-platform"
echo "   3. Test dropdowns on iOS devices"