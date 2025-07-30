# AVS.ma Deployment Instructions

## Quick Deployment Guide

### 1. First-Time Server Setup

On your VPS, run the initial setup script:

```bash
# Download and run the setup script
wget https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/initial-setup.sh
chmod +x initial-setup.sh
sudo ./initial-setup.sh
```

This will:
- Install Node.js, Nginx, PM2, Certbot
- Create the `appuser` account
- Set up the application directory
- Generate SSH keys for GitHub
- Configure firewall and security

### 2. Add Deploy Key to GitHub

After running the setup script, add the SSH public key to your GitHub repository:

1. Copy the SSH key displayed at the end of setup
2. Go to your GitHub repository → Settings → Deploy keys
3. Add new deploy key and paste the public key
4. Enable "Allow write access"

### 3. Deploy Your Application

```bash
# Download and run the deployment script
wget https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/server-deploy.sh
chmod +x server-deploy.sh

# Update the REPO_URL in the script with your actual GitHub repository
sudo ./server-deploy.sh
```

This will:
- Deploy nginx configuration
- Install dependencies and build the app
- Set up SSL certificate with Let's Encrypt
- Start the application with PM2

### 4. Set Up GitHub Actions (Automatic Deployments)

The GitHub Actions workflow is already configured. Make sure you have these secrets in your GitHub repository:

- `VPS_HOST`: Your VPS IP address (213.210.20.104)
- `VPS_USERNAME`: `appuser`
- `VPS_SSH_KEY`: The private SSH key from `/home/appuser/.ssh/id_rsa`

### 5. Configure DNS

Point your domain to your VPS:
- A record: `avs.ma` → `213.210.20.104`
- A record: `www.avs.ma` → `213.210.20.104`

## Manual Deployment Commands

If you need to deploy manually:

```bash
# Switch to app user
sudo su - appuser

# Navigate to app directory
cd /var/www/avswebsite

# Pull latest changes
git pull origin main

# Install dependencies
npm ci

# Build application
npm run build

# Update nginx config (as root)
sudo cp nginx.conf /etc/nginx/sites-available/avs.ma.conf
sudo nginx -t && sudo systemctl reload nginx

# Restart PM2
pm2 reload ecosystem.config.js --env production
```

## Troubleshooting

### Check Application Status
```bash
# Check if website is running
curl -I https://avs.ma

# Check PM2 processes
pm2 list

# Check nginx status
sudo systemctl status nginx
```

### View Logs
```bash
# Application logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/avs.ma.error.log
sudo tail -f /var/log/nginx/avs.ma.access.log

# Deployment logs
sudo tail -f /var/log/avswebsite-deploy.log
```

### Common Issues

1. **Website not accessible**: Check nginx configuration and DNS settings
2. **SSL certificate issues**: Run `sudo certbot renew --dry-run`
3. **Build failures**: Check if Node.js version is correct and dependencies install properly
4. **Permission errors**: Ensure appuser owns the application directory

### Useful Commands

```bash
# Restart nginx
sudo systemctl restart nginx

# Restart PM2 processes
pm2 restart all

# Check disk space
df -h

# Check memory usage
free -h

# View active connections
ss -tuln
```

## File Locations

- **Application**: `/var/www/avswebsite`
- **Nginx config**: `/etc/nginx/sites-available/avs.ma.conf`
- **SSL certificates**: `/etc/letsencrypt/live/avs.ma/`
- **PM2 logs**: `/home/appuser/.pm2/logs/`
- **Deployment logs**: `/var/log/avswebsite-deploy.log`

## Security Notes

- The server has UFW firewall enabled
- fail2ban is configured for SSH protection
- SSL/TLS certificates auto-renew via certbot
- SSH key authentication is required for deployments