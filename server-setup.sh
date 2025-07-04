#!/bin/bash

# VPS Server Setup Script for Education Platform
# Run this script on your VPS to set up the deployment environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    error "Please run this script as root (use sudo)"
    exit 1
fi

log "Starting VPS setup for Education Platform"

# Update system
log "Updating system packages"
apt update && apt upgrade -y

# Install essential packages
log "Installing essential packages"
apt install -y curl wget git unzip software-properties-common ufw fail2ban

# Install Node.js 18
log "Installing Node.js 18"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install Nginx
log "Installing Nginx"
apt install -y nginx

# Install PM2
log "Installing PM2"
npm install -g pm2 serve

# Create application user
log "Creating application user"
useradd -m -s /bin/bash appuser
usermod -aG www-data appuser

# Create application directory
log "Creating application directory"
mkdir -p /var/www/your-app
chown -R appuser:www-data /var/www/your-app
chmod -R 755 /var/www/your-app

# Create backup directory
log "Creating backup directory"
mkdir -p /var/backups/your-app
chown -R appuser:www-data /var/backups/your-app

# Create log directories
log "Creating log directories"
mkdir -p /var/log/pm2
chown -R appuser:www-data /var/log/pm2

# Configure UFW firewall
log "Configuring firewall"
ufw --force enable
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 80
ufw allow 443

# Configure fail2ban
log "Configuring fail2ban"
systemctl enable fail2ban
systemctl start fail2ban

# Install Certbot for SSL
log "Installing Certbot for SSL certificates"
apt install -y certbot python3-certbot-nginx

# Configure Nginx
log "Configuring Nginx"
systemctl enable nginx
systemctl start nginx

# Create systemd service for auto-deployment
log "Creating deployment webhook service"
cat > /etc/systemd/system/deploy-webhook.service << EOF
[Unit]
Description=Deployment Webhook Service
After=network.target

[Service]
Type=simple
User=appuser
WorkingDirectory=/var/www/your-app
ExecStart=/usr/bin/node webhook.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Enable services
log "Enabling services"
systemctl enable deploy-webhook.service

# Configure PM2 startup
log "Configuring PM2 startup"
sudo -u appuser pm2 startup systemd -u appuser --hp /home/appuser
env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u appuser --hp /home/appuser

# Create deployment script
log "Creating deployment script"
cp deploy.sh /home/appuser/deploy.sh
chown appuser:appuser /home/appuser/deploy.sh
chmod +x /home/appuser/deploy.sh

# Setup SSH key for GitHub
log "Setting up SSH for GitHub deployment"
sudo -u appuser ssh-keygen -t ed25519 -f /home/appuser/.ssh/github_deploy -N ""
sudo -u appuser cat /home/appuser/.ssh/github_deploy.pub

warn "Please add the above SSH public key to your GitHub repository as a deploy key"

# Configure Git for appuser
log "Configuring Git"
sudo -u appuser git config --global user.name "VPS Deploy"
sudo -u appuser git config --global user.email "deploy@your-domain.com"

# Create initial clone
log "Please run the following commands as appuser to complete setup:"
echo "sudo -u appuser git clone git@github.com:yourusername/your-repo.git /var/www/your-app"
echo "cd /var/www/your-app && npm install && npm run build"
echo "pm2 start ecosystem.config.js && pm2 save"

# Security hardening
log "Applying basic security hardening"
# Disable root login via SSH
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart ssh

# Set up log rotation
log "Setting up log rotation"
cat > /etc/logrotate.d/your-app << EOF
/var/log/pm2/*.log {
    daily
    missingok
    rotate 52
    compress
    notifempty
    create 644 appuser appuser
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

log "VPS setup completed successfully!"
log "Next steps:"
log "1. Add the SSH public key to your GitHub repository"
log "2. Clone your repository to /var/www/your-app"
log "3. Configure your domain DNS to point to this server"
log "4. Run certbot to get SSL certificate: certbot --nginx -d your-domain.com"
log "5. Update nginx configuration with your domain name"
log "6. Test the deployment"

warn "Remember to secure your server further and keep it updated!"