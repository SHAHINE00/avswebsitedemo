#!/bin/bash

# AVS.ma Server Deployment Script
# Run this script on your VPS to deploy the website

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    error "Please run as root (use sudo)"
    exit 1
fi

# Configuration
REPO_URL="https://github.com/SHAHINE00/avswebsitedemo.git"
APP_DIR="/var/www/avswebsite"
DOMAIN="avs.ma"
EMAIL="admin@avs.ma"  # Replace with your email

log "Starting AVS.ma deployment..."

# Step 0: Fix permissions and handle git conflicts
log "Fixing file permissions..."
chown -R appuser:www-data $APP_DIR
find $APP_DIR -type d -exec chmod 755 {} \;
find $APP_DIR -type f -exec chmod 644 {} \;

log "Handling git conflicts and updating repository..."
cd $APP_DIR

# Stash any local changes and clean untracked files
sudo -u appuser git stash || true
sudo -u appuser git clean -fd || true

# Force pull latest changes
sudo -u appuser git pull origin main --force || {
    warn "Git pull failed, attempting reset..."
    sudo -u appuser git fetch origin
    sudo -u appuser git reset --hard origin/main
}

log "Repository updated successfully"

# Step 1: Deploy Nginx Configuration
log "Deploying Nginx configuration..."
if [ -f "$APP_DIR/nginx.conf" ]; then
    cp $APP_DIR/nginx.conf /etc/nginx/sites-available/avs.ma.conf
    ln -sf /etc/nginx/sites-available/avs.ma.conf /etc/nginx/sites-enabled/
    
    # Test nginx configuration
    if nginx -t; then
        log "Nginx configuration is valid"
        systemctl reload nginx
    else
        error "Nginx configuration test failed!"
        exit 1
    fi
else
    warn "nginx.conf not found in $APP_DIR, skipping nginx configuration"
fi

# Step 2: Install dependencies and build
log "Installing dependencies..."
cd $APP_DIR
sudo -u appuser npm ci

log "Building application..."
sudo -u appuser npm run build

# Step 3: Set correct permissions
log "Setting correct permissions..."
chown -R appuser:www-data $APP_DIR
find $APP_DIR -type d -exec chmod 755 {} \;
find $APP_DIR -type f -exec chmod 644 {} \;

if [ -d "$APP_DIR/dist" ]; then
    chown -R appuser:www-data $APP_DIR/dist
    chmod -R 755 $APP_DIR/dist
    log "Application built successfully in $APP_DIR/dist"
else
    error "Build failed - dist directory not found!"
    exit 1
fi

# Step 4: Set up SSL certificate
log "Setting up SSL certificate..."
if command -v certbot &> /dev/null; then
    # Check if certificate already exists
    if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
        log "Obtaining SSL certificate for $DOMAIN..."
        certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive
    else
        log "SSL certificate already exists for $DOMAIN"
    fi
else
    warn "Certbot not found. Installing certbot..."
    apt update
    apt install -y certbot python3-certbot-nginx
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive
fi

# Step 5: Start/restart PM2 if using it
if command -v pm2 &> /dev/null; then
    log "Managing PM2 processes..."
    sudo -u appuser pm2 reload ecosystem.config.cjs --env production 2>/dev/null || sudo -u appuser pm2 start ecosystem.config.cjs --env production
    sudo -u appuser pm2 save
else
    log "PM2 not found, skipping process management"
fi

# Step 6: Final health check
log "Performing health check..."
sleep 5

if curl -f -s https://$DOMAIN >/dev/null; then
    log "✅ Deployment successful! Website is accessible at https://$DOMAIN"
else
    warn "Health check failed. Website might not be accessible yet."
    log "Check nginx logs: tail -f /var/log/nginx/avs.ma.error.log"
fi

log "Deployment completed!"
log ""
log "Next steps:"
log "1. Verify your website is working: https://$DOMAIN"
log "2. Check logs if issues: tail -f /var/log/nginx/avs.ma.error.log"
log "3. Set up GitHub Actions for automatic deployments"
log ""
log "Useful commands:"
log "- Check nginx status: systemctl status nginx"
log "- Reload nginx: systemctl reload nginx"
log "- Check PM2 processes: pm2 list"
log "- View application logs: pm2 logs"