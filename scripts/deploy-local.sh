#!/bin/bash

# Local deployment script for manual deployment
# Run this script to deploy changes manually to your VPS

set -e

echo "🚀 Starting deployment process..."

# Step 1: Update dependencies and fix security issues
echo "📦 Updating dependencies and fixing security issues..."
npm ci
npm audit fix --audit-level moderate || echo "⚠️ Some vulnerabilities could not be auto-fixed"
npx update-browserslist-db@latest || echo "⚠️ Could not update browserslist data"

# Step 2: Build the application
echo "🔨 Building application..."
npm run build

# Step 3: Test the build locally
echo "🧪 Testing build locally..."
npm run preview &
PREVIEW_PID=$!
sleep 5
curl -f http://localhost:4173 > /dev/null 2>&1 && echo "✅ Local build test passed" || echo "❌ Local build test failed"
kill $PREVIEW_PID 2>/dev/null || true

# Step 4: Deploy to VPS (requires SSH access)
echo "📤 Deploying to VPS..."
ssh root@your-vps-ip << 'ENDSSH'
cd /var/www/avswebsite
git pull origin main
npm ci
npm audit fix --audit-level moderate || true
npx update-browserslist-db@latest || true
npm run build

# Set permissions
chown -R appuser:www-data /var/www/avswebsite
chmod -R 755 /var/www/avswebsite

# Reload nginx
systemctl reload nginx

# Restart PM2
pm2 reload ecosystem.config.js --env production || pm2 start ecosystem.config.js --env production
pm2 save
ENDSSH

# Step 5: Health check
echo "🏥 Running health check..."
sleep 10
curl -f https://avs.ma > /dev/null 2>&1 && echo "✅ Deployment successful!" || echo "❌ Health check failed"

echo "🎉 Deployment process completed!"