#!/bin/bash

# AVS.ma VPS Deployment Script
# Usage: ./deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-production}
APP_DIR="/var/www/avswebsite"
BACKUP_DIR="/var/backups/avswebsite"
LOG_FILE="/var/log/avswebsite-deploy.log"

echo "$(date): Starting deployment for $ENVIRONMENT environment" >> $LOG_FILE

# Function to log messages
log() {
    echo "$(date): $1" | tee -a $LOG_FILE
}

# Function to create backup
backup_current() {
    log "Creating backup of current deployment"
    if [ -d "$APP_DIR" ]; then
        BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
        sudo cp -r $APP_DIR $BACKUP_DIR/$BACKUP_NAME
        log "Backup created: $BACKUP_DIR/$BACKUP_NAME"
    fi
}

# Function to rollback
rollback() {
    log "Rolling back deployment"
    LATEST_BACKUP=$(ls -t $BACKUP_DIR | head -n1)
    if [ -n "$LATEST_BACKUP" ]; then
        sudo rm -rf $APP_DIR/*
        sudo cp -r $BACKUP_DIR/$LATEST_BACKUP/* $APP_DIR/
        sudo systemctl restart nginx
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
    
    # Clean npm cache and install dependencies
    log "Cleaning npm cache and installing dependencies"
    npm cache clean --force
    rm -rf node_modules package-lock.json
    npm install
    
    # Verify vite installation
    log "Verifying vite installation"
    if [ ! -f "node_modules/.bin/vite" ]; then
        log "Warning: vite not found in .bin, trying to reinstall"
        npm install vite --save-dev
    fi
    
    # Build application
    log "Building application"
    export NODE_ENV=$ENVIRONMENT
    if [ -f "node_modules/.bin/vite" ]; then
        npm run build
    else
        log "Using npx as fallback for vite build"
        npx vite build
    fi
    
    # Clean up devDependencies to save space
    log "Cleaning up devDependencies"
    npm prune --production
    
    # Update nginx configuration
    log "Updating Nginx configuration"
    sudo cp nginx.conf /etc/nginx/sites-available/avs.ma.conf
    sudo nginx -t && sudo systemctl reload nginx
    
    # Update file permissions
    log "Updating file permissions"
    sudo chown -R appuser:www-data $APP_DIR
    sudo chmod -R 755 $APP_DIR
    
    # Restart services
    log "Restarting services"
    pm2 reload ecosystem.config.cjs --env $ENVIRONMENT
    sudo systemctl reload nginx
    
    # Health check
    log "Performing health check"
    sleep 10
    
    if curl -f -s https://avs.ma > /dev/null; then
        log "Health check passed"
    else
        log "Health check failed"
        rollback
        exit 1
    fi
    
    # Cleanup old backups (keep last 5)
    log "Cleaning up old backups"
    cd $BACKUP_DIR
    ls -t | tail -n +6 | xargs -r rm -rf
    
    log "Deployment completed successfully"
}

# Check if running as proper user
if [ "$EUID" -eq 0 ]; then
    log "Please don't run this script as root"
    exit 1
fi

# Run main deployment
main

log "Deployment finished"