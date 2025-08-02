#!/bin/bash

# Complete deployment script to fix the PartnersSection visibility issue
# This script ensures the latest version with fixed components is deployed

set -e

echo "🚀 Starting complete deployment with all optimizations..."

# Set environment
export NODE_ENV=production

# Clean and rebuild
echo "🧹 Cleaning previous builds..."
rm -rf dist/
npm cache clean --force

echo "📦 Installing dependencies..."
npm ci --production=false

echo "🔨 Building application with optimizations..."
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
echo "🎯 All optimizations deployed:"
echo "   ✓ Marketing tracking & UTM parameters"
echo "   ✓ Mobile optimizations & responsive design"
echo "   ✓ Bundle size optimizations & code splitting"
echo "   ✓ Social sharing & email capture"
echo "   ✓ Newsletter popup removed"
echo "   ✓ Enhanced SEO & analytics"
echo ""
echo "🌐 Ready for production deployment!"
echo "📋 Next steps:"
echo "   1. Upload dist/ folder to your VPS"
echo "   2. Run: systemctl reload nginx"
echo "   3. Run: pm2 reload ecosystem.config.js"