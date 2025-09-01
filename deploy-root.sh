#!/bin/bash

# AVS.ma Root Deployment Script - Modified for root user
# Usage: ./deploy-root.sh

set -e

APP_DIR="/var/www/avswebsite"
BACKUP_DIR="/var/backups/avswebsite"
LOG_FILE="/var/log/avswebsite-deploy.log"

echo "$(date): Starting root deployment" >> $LOG_FILE

# Function to log messages
log() {
    echo "$(date): $1" | tee -a $LOG_FILE
}

# Function to create backup
backup_current() {
    log "Creating backup of current deployment"
    if [ -d "$APP_DIR" ]; then
        mkdir -p $BACKUP_DIR
        BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
        cp -r $APP_DIR $BACKUP_DIR/$BACKUP_NAME
        log "Backup created: $BACKUP_DIR/$BACKUP_NAME"
    fi
}

# Function to rollback
rollback() {
    log "Rolling back deployment"
    LATEST_BACKUP=$(ls -t $BACKUP_DIR 2>/dev/null | head -n1)
    if [ -n "$LATEST_BACKUP" ]; then
        rm -rf $APP_DIR/*
        cp -r $BACKUP_DIR/$LATEST_BACKUP/* $APP_DIR/
        systemctl restart nginx
        pm2 restart ecosystem.config.cjs
        log "Rollback completed"
    else
        log "No backup found for rollback"
        exit 1
    fi
}

# Set trap for error handling
trap 'log "Deployment failed. Starting rollback..."; rollback' ERR

# Main deployment process
main() {
    log "Starting deployment process"
    
    # Create backup
    backup_current
    
    # Navigate to app directory
    cd $APP_DIR
    
    # Pull latest code
    log "Pulling latest code from repository"
    git fetch origin
    git reset --hard origin/main
    
    # Fix ownership first
    log "Fixing ownership to appuser"
    chown -R appuser:appuser $APP_DIR
    
    # Install dependencies and build as appuser to avoid root ownership issues
    log "Building application as appuser"
    sudo -u appuser bash << 'APPUSER_BUILD'
        cd /var/www/avswebsite
        
        # Update browserslist if needed
        npx update-browserslist-db@latest 2>/dev/null || true
        
        # Clean and install
        npm cache clean --force
        rm -rf node_modules package-lock.json
        npm install
        
        # Build
        export NODE_ENV=production
        npm run build
APPUSER_BUILD
    
    # Fix ownership and permissions
    log "Setting correct ownership and permissions"
    chown -R appuser:www-data $APP_DIR/dist/
    find $APP_DIR/dist/ -type d -exec chmod 755 {} \;
    find $APP_DIR/dist/ -type f -exec chmod 644 {} \;
    
    # Update nginx configuration
    log "Updating Nginx configuration"
    cp nginx.conf /etc/nginx/sites-available/avs.ma.conf
    ln -sf /etc/nginx/sites-available/avs.ma.conf /etc/nginx/sites-enabled/
    
    # Test and reload nginx
    nginx -t && systemctl reload nginx
    
    # Restart PM2
    log "Restarting PM2"
    pm2 reload ecosystem.config.cjs --env production
    pm2 save
    
    # Health check
    log "Performing health check"
    sleep 10
    
    if curl -f -s https://avs.ma > /dev/null; then
        log "✅ Health check passed"
        log "🎉 Deployment completed successfully"
        echo ""
        echo "🌐 Your website is live at: https://avs.ma"
        echo "📊 Check PM2 status: pm2 list"
        echo "📋 Check logs: pm2 logs"
    else
        log "❌ Health check failed"
        rollback
        exit 1
    fi
    
    # Cleanup old backups (keep last 5)
    log "Cleaning up old backups"
    cd $BACKUP_DIR 2>/dev/null && ls -t | tail -n +6 | xargs -r rm -rf || true
}

# Check if in correct directory
if [ ! -f "ecosystem.config.cjs" ]; then
    echo "❌ Please run this script from /var/www/avswebsite"
    echo "📂 Run: cd /var/www/avswebsite"
    exit 1
fi

# Run main deployment
main

log "Deployment finished"