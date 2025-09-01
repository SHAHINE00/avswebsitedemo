#!/bin/bash

# Quick deployment script for AVS.ma
# Run as root from /var/www/avswebsite

set -e

echo "🚀 Starting quick deployment..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root (sudo ./scripts/deploy-quick.sh)"
    exit 1
fi

# Check if in correct directory
if [ ! -f "ecosystem.config.cjs" ]; then
    echo "❌ Please run from /var/www/avswebsite"
    echo "📂 Run: cd /var/www/avswebsite && sudo ./scripts/deploy-quick.sh"
    exit 1
fi

APP_DIR="/var/www/avswebsite"
cd $APP_DIR

# Fix ownership first
echo "🔧 Fixing ownership..."
chown -R appuser:appuser $APP_DIR

# Pull latest code and build as appuser
echo "📥 Pulling latest code and building..."
sudo -u appuser bash -c "
    cd $APP_DIR
    git fetch origin && git reset --hard origin/main
    
    # Update browserslist if needed
    npx update-browserslist-db@latest 2>/dev/null || true
    
    # Clean build
    rm -rf node_modules dist 2>/dev/null || true
    npm cache clean --force
    npm ci
    
    export NODE_ENV=production
    npm run build
"

# Set correct permissions for dist
echo "🔐 Setting permissions..."
chown -R appuser:www-data dist/
find dist/ -type d -exec chmod 755 {} \;
find dist/ -type f -exec chmod 644 {} \;

# Update nginx
echo "🌐 Updating Nginx..."
cp nginx.conf /etc/nginx/sites-available/avs.ma.conf
ln -sf /etc/nginx/sites-available/avs.ma.conf /etc/nginx/sites-enabled/
if nginx -t; then
    systemctl reload nginx
    echo "✅ Nginx reloaded"
else
    echo "❌ Nginx configuration test failed"
    exit 1
fi

# Restart PM2 as appuser
echo "⚡ Restarting PM2..."
sudo -u appuser pm2 reload ecosystem.config.cjs --env production || sudo -u appuser pm2 start ecosystem.config.cjs --env production
sudo -u appuser pm2 save

# Health check
echo "🏥 Health check..."
sleep 5
if curl -f -s https://avs.ma > /dev/null; then
    echo "✅ Deployment successful!"
    echo "🌐 Website: https://avs.ma"
    echo "📊 PM2 status: sudo -u appuser pm2 list"
else
    echo "❌ Health check failed"
    exit 1
fi

echo "🎉 Quick deployment completed!"