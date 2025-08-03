#!/bin/bash

# Deploy comprehensive cross-browser compatibility fixes
# Eliminates PWA prompts and optimizes for all devices and browsers

set -e

echo "🌐 Deploying comprehensive cross-browser optimization..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
npm cache clean --force

echo "📦 Installing dependencies..."
npm ci --production=false

echo "🔨 Building application with cross-browser optimizations..."
npm run build

# Verify critical files exist
if [ ! -f "dist/index.html" ]; then
    echo "❌ Build failed - no index.html found"
    exit 1
fi

# Check if manifest.json exists and handle it
if [ -f "dist/manifest.json" ]; then
    echo "🗑️ Removing PWA manifest to eliminate install prompts..."
    rm -f dist/manifest.json
fi

echo "✅ Cross-browser optimization build completed successfully!"
echo ""
echo "🎯 Key improvements included:"
echo "   ✓ Complete PWA removal - no more install prompts on any browser"
echo "   ✓ iOS Safari optimizations (viewport, touch, scrolling)"
echo "   ✓ Android Chrome enhancements (font rendering, touch targets)"
echo "   ✓ Safari-specific fixes (touch callout, user selection)"
echo "   ✓ Edge/IE compatibility layers"
echo "   ✓ Firefox scroll optimizations"
echo "   ✓ Universal 44px+ touch targets for accessibility"
echo "   ✓ Enhanced viewport handling with safe areas"
echo "   ✓ Cross-browser font rendering improvements"
echo "   ✓ Performance optimizations for all devices"
echo ""
echo "🌍 Supported browsers and devices:"
echo "   • iOS Safari (iPhone/iPad)"
echo "   • Android Chrome"
echo "   • Desktop Safari (macOS)"
echo "   • Desktop Chrome (Windows/macOS/Linux)"
echo "   • Firefox (all platforms)"
echo "   • Microsoft Edge"
echo ""
echo "📊 Build verification:"
ls -la dist/ | head -10
echo ""
echo "🚀 Ready for VPS deployment!"
echo "📋 Next steps:"
echo "   1. Upload dist/ folder to your VPS"
echo "   2. Restart your web server"
echo "   3. Test on all target devices - no more install prompts!"