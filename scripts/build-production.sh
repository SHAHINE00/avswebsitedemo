#!/bin/bash

# Production build script with optimizations
# This script ensures proper production builds with cache busting

set -e

echo "🔨 Starting production build..."

# Set production environment
export NODE_ENV=production

# Clean previous build
if [ -d "dist" ]; then
    echo "🧹 Cleaning previous build..."
    rm -rf dist
fi

# Run production build
echo "⚙️ Building with production optimizations..."
npx vite build --mode production

# Verify build output
if [ ! -f "dist/index.html" ]; then
    echo "❌ Build failed - no index.html found"
    exit 1
fi

# Add build timestamp for verification
echo "<!-- Build timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ) -->" >> dist/index.html

# Show build stats
echo "✅ Production build completed successfully!"
echo "📊 Build stats:"
du -sh dist/
find dist -name "*.js" -o -name "*.css" | head -5 | while read file; do
    echo "  📄 $(basename "$file"): $(du -h "$file" | cut -f1)"
done

echo "🎉 Production build ready for deployment!"