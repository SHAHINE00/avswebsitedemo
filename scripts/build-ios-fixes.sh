#!/bin/bash

# Deploy iOS Safari fixes to production
echo "🍎 Building iOS Safari fixes..."

# Clean and build
rm -rf dist/
npm run build

echo "✅ iOS Safari fixes ready for deployment!"
echo "📱 Upload dist/ folder to your server to deploy the fixes"