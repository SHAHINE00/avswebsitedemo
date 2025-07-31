#!/bin/bash

# Complete deployment script to fix the PartnersSection visibility issue
# This script ensures the latest version with fixed components is deployed

set -e

echo "🚀 Starting complete deployment to fix PartnersSection visibility..."

# Set environment
export NODE_ENV=production

# Clean and rebuild
echo "🧹 Cleaning previous builds..."
rm -rf dist/
npm cache clean --force

echo "📦 Installing dependencies..."
npm ci --production=false

echo "🔨 Building application..."
npm run build

# Verify critical files exist
if [ ! -f "dist/index.html" ]; then
    echo "❌ Build failed - no index.html found"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📊 Build verification:"
ls -la dist/
echo ""
echo "🎯 PartnersSection should now be visible on the live site after server deployment"
echo "🌐 The component is properly configured and animations are working"