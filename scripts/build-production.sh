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

# Generate sitemap.xml
echo "🗺️  Generating sitemap.xml..."
node scripts/generate-sitemap.js

# Run console cleanup before build
echo "🧹 Cleaning up console statements for production..."
node scripts/cleanup-console-production.js || echo "Console cleanup script not found - continuing build"

# Run production build
echo "⚙️ Building with production optimizations..."
VITE_DISABLE_CONSOLE=true npx vite build --mode production

# Verify build output
if [ ! -f "dist/index.html" ]; then
    echo "❌ Build failed - no index.html found"
    exit 1
fi

# Add build timestamp for verification
echo "<!-- Build timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ) -->" >> dist/index.html

# Security optimizations
echo "🔒 Applying security optimizations..."
# Remove source maps in production
find dist -name "*.js.map" -delete
find dist -name "*.css.map" -delete

# Add comprehensive security headers to index.html
sed -i '/<head>/a \  <meta http-equiv="X-Content-Type-Options" content="nosniff">\n  <meta http-equiv="X-Frame-Options" content="DENY">\n  <meta http-equiv="X-XSS-Protection" content="1; mode=block">\n  <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">\n  <meta http-equiv="Permissions-Policy" content="geolocation=(), microphone=(), camera=()">' dist/index.html || true

# Show build stats
echo "✅ Production build completed successfully!"
echo "📊 Build stats:"
du -sh dist/
find dist -name "*.js" -o -name "*.css" | head -5 | while read file; do
    echo "  📄 $(basename "$file"): $(du -h "$file" | cut -f1)"
done

echo "🎉 Production build ready for deployment!"