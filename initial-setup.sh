#!/bin/bash

# AVS.ma Initial Server Setup Script
# Run this ONCE on a fresh VPS to set up the server environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    error "Please run as root (use sudo)"
    exit 1
fi

log "Starting AVS.ma server setup..."

# Configuration
REPO_URL="https://github.com/YOUR_USERNAME/YOUR_REPO.git"  # Replace with your actual GitHub repo
APP_DIR="/var/www/avswebsite"
DOMAIN="avs.ma"

# Step 1: Update system
log "Updating system packages..."
apt update && apt upgrade -y

# Step 2: Install essential packages
log "Installing essential packages..."
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release ufw fail2ban

# Step 3: Install Node.js 18
log "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Step 4: Install PM2
log "Installing PM2..."
npm install -g pm2

# Step 5: Create application user
log "Creating application user..."
if ! id "appuser" &>/dev/null; then
    useradd -m -s /bin/bash appuser
    usermod -aG www-data appuser
    log "Created user: appuser"
else
    log "User appuser already exists"
fi

# Step 6: Create application directory
log "Setting up application directory..."
mkdir -p $APP_DIR
chown appuser:www-data $APP_DIR
chmod 755 $APP_DIR

# Step 7: Clone repository (if not already done)
if [ ! -d "$APP_DIR/.git" ]; then
    log "Cloning repository..."
    info "Please update REPO_URL in this script with your actual GitHub repository URL"
    read -p "Enter your GitHub repository URL: " REPO_URL
    sudo -u appuser git clone $REPO_URL $APP_DIR
else
    log "Repository already cloned"
fi

# Step 8: Install Nginx
log "Installing Nginx..."
apt install -y nginx

# Step 9: Configure firewall
log "Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# Step 10: Configure fail2ban
log "Configuring fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban

# Step 11: Install Certbot
log "Installing Certbot for SSL..."
apt install -y certbot python3-certbot-nginx

# Step 12: Set up GitHub SSH key (for automated deployments)
log "Setting up SSH key for GitHub deployments..."
if [ ! -f /home/appuser/.ssh/id_rsa ]; then
    sudo -u appuser ssh-keygen -t rsa -b 4096 -f /home/appuser/.ssh/id_rsa -N ""
    log "SSH key generated. Add this public key to your GitHub repository deploy keys:"
    echo "---"
    cat /home/appuser/.ssh/id_rsa.pub
    echo "---"
else
    log "SSH key already exists:"
    cat /home/appuser/.ssh/id_rsa.pub
fi

# Step 13: Configure Git for appuser
log "Configuring Git for appuser..."
sudo -u appuser git config --global user.name "AVS App User"
sudo -u appuser git config --global user.email "appuser@$DOMAIN"

# Step 14: Set up log rotation
log "Setting up log rotation..."
cat > /etc/logrotate.d/pm2-appuser << EOF
/home/appuser/.pm2/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    notifempty
    create 0644 appuser appuser
    postrotate
        sudo -u appuser pm2 reloadLogs
    endscript
}
EOF

# Step 15: Create directories for logs
log "Creating log directories..."
mkdir -p /var/log/nginx
mkdir -p /var/backups/avswebsite
chown appuser:www-data /var/backups/avswebsite

log "✅ Server setup completed!"
log ""
log "Next steps:"
log "1. Add the SSH public key (shown above) to your GitHub repository deploy keys"
log "2. Update the repository URL in server-deploy.sh if needed"
log "3. Run server-deploy.sh to deploy your application"
log "4. Configure your domain DNS to point to this server IP"
log ""
log "Important information:"
log "- Application directory: $APP_DIR"
log "- Application user: appuser"
log "- Domain: $DOMAIN"
log "- Server IP: $(curl -s ifconfig.me)"
log ""
log "GitHub Deploy Key (add this to your repository):"
echo "---"
cat /home/appuser/.ssh/id_rsa.pub
echo "---"