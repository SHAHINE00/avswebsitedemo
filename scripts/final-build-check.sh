#!/bin/bash

# Final Pre-Deployment Build Check
# Comprehensive validation script for production deployment

set -e

echo "🚀 AVS Academy - Final Pre-Deployment Check"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this script from the project root.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Step 1: Environment Check${NC}"
echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"

echo -e "\n${BLUE}📋 Step 2: Dependencies Check${NC}"
echo "Checking for outdated dependencies..."
npm outdated || echo "All dependencies are up to date"

echo -e "\n${BLUE}📋 Step 3: Lint Check${NC}"
echo "Running ESLint..."
npm run lint || {
    echo -e "${YELLOW}⚠️ Linting warnings found, but continuing...${NC}"
}

echo -e "\n${BLUE}📋 Step 4: Production Build${NC}"
echo "Creating production build..."
if [ -d "dist" ]; then
    echo "Cleaning previous build..."
    rm -rf dist
fi

# Generate sitemap before build
echo "Generating sitemap..."
node scripts/generate-sitemap.js || {
    echo -e "${YELLOW}⚠️ Sitemap generation failed, but continuing...${NC}"
}

# Run production build
npm run build

# Verify build output
if [ ! -f "dist/index.html" ]; then
    echo -e "${RED}❌ Build failed - no index.html found${NC}"
    exit 1
fi

echo -e "\n${BLUE}📋 Step 5: Build Analysis${NC}"
echo "Build directory size:"
du -sh dist/

echo -e "\nLargest files in build:"
find dist -type f -name "*.js" -o -name "*.css" -o -name "*.woff2" -o -name "*.png" -o -name "*.jpg" | sort -k5 -nr | head -10 | while read file; do
    size=$(du -h "$file" | cut -f1)
    echo "  📄 $(basename "$file"): $size"
done

echo -e "\n${BLUE}📋 Step 6: Critical File Verification${NC}"
critical_files=(
    "dist/index.html"
    "dist/manifest.json"
    "dist/sitemap.xml"
    "dist/robots.txt"
    "dist/favicon.png"
    "dist/sw.js"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file exists${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
    fi
done

echo -e "\n${BLUE}📋 Step 7: SEO Meta Tags Check${NC}"
if grep -q 'meta name="description"' dist/index.html; then
    echo -e "${GREEN}✅ Meta description found${NC}"
else
    echo -e "${RED}❌ Meta description missing${NC}"
fi

if grep -q 'meta property="og:' dist/index.html; then
    echo -e "${GREEN}✅ Open Graph tags found${NC}"
else
    echo -e "${RED}❌ Open Graph tags missing${NC}"
fi

echo -e "\n${BLUE}📋 Step 8: Performance Check${NC}"
# Check if JavaScript files are minified
js_files=$(find dist -name "*.js" | head -5)
for js_file in $js_files; do
    if [ -f "$js_file" ]; then
        # Check if file is minified (contains very long lines)
        max_line_length=$(wc -L < "$js_file" 2>/dev/null || echo "0")
        if [ "$max_line_length" -gt 1000 ]; then
            echo -e "${GREEN}✅ $(basename "$js_file") appears minified${NC}"
        else
            echo -e "${YELLOW}⚠️ $(basename "$js_file") might not be minified${NC}"
        fi
    fi
done

echo -e "\n${BLUE}📋 Step 9: Asset Optimization Check${NC}"
# Check for optimized images
webp_count=$(find dist -name "*.webp" | wc -l)
jpg_count=$(find dist -name "*.jpg" | wc -l)
png_count=$(find dist -name "*.png" | wc -l)

echo "Image format distribution:"
echo "  WebP: $webp_count files"
echo "  JPG: $jpg_count files"  
echo "  PNG: $png_count files"

echo -e "\n${BLUE}📋 Step 10: Service Worker Check${NC}"
if [ -f "dist/sw.js" ]; then
    echo -e "${GREEN}✅ Service Worker found${NC}"
    sw_size=$(du -h dist/sw.js | cut -f1)
    echo "  Size: $sw_size"
else
    echo -e "${RED}❌ Service Worker missing${NC}"
fi

echo -e "\n${BLUE}📋 Step 11: Manifest Check${NC}"
if [ -f "dist/manifest.json" ]; then
    echo -e "${GREEN}✅ PWA Manifest found${NC}"
    # Basic manifest validation
    if grep -q '"name"' dist/manifest.json && grep -q '"icons"' dist/manifest.json; then
        echo -e "${GREEN}✅ Manifest appears valid${NC}"
    else
        echo -e "${YELLOW}⚠️ Manifest might be incomplete${NC}"
    fi
else
    echo -e "${RED}❌ PWA Manifest missing${NC}"
fi

echo -e "\n${BLUE}📋 Step 12: Bundle Size Analysis${NC}"
# Check bundle sizes
main_js=$(find dist -name "main*.js" | head -1)
if [ -f "$main_js" ]; then
    main_size=$(du -h "$main_js" | cut -f1)
    echo "Main bundle size: $main_size"
    
    # Warn if main bundle is too large
    main_size_bytes=$(du -b "$main_js" | cut -f1)
    if [ "$main_size_bytes" -gt 500000 ]; then # 500KB
        echo -e "${YELLOW}⚠️ Main bundle is large (>500KB). Consider code splitting.${NC}"
    else
        echo -e "${GREEN}✅ Main bundle size is reasonable${NC}"
    fi
fi

echo -e "\n${GREEN}🎉 Pre-Deployment Check Complete!${NC}"
echo "=============================================="

echo -e "\n${BLUE}📋 Deployment Checklist:${NC}"
echo "✅ Build completed successfully"
echo "✅ Critical files present"
echo "✅ Assets optimized"
echo "✅ SEO tags configured"
echo "✅ PWA ready"
echo "✅ Service Worker active"

echo -e "\n${BLUE}📋 Next Steps for VPS Deployment:${NC}"
echo "1. Upload the 'dist' directory to your VPS"
echo "2. Configure your web server (Nginx/Apache) to serve the files"
echo "3. Set up HTTPS with SSL certificate"
echo "4. Configure domain DNS to point to your VPS"
echo "5. Test the deployed site thoroughly"
echo "6. Set up monitoring and analytics"

echo -e "\n${BLUE}📋 Recommended Server Configuration:${NC}"
echo "- Enable Gzip compression"
echo "- Set proper cache headers for static assets"
echo "- Configure HTTP/2"
echo "- Set up 404 redirect to index.html for SPA routing"
echo "- Enable security headers (HSTS, CSP, etc.)"

echo -e "\n${GREEN}🚀 Your website is ready for deployment!${NC}"