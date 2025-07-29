# Hostinger VPS Automatic Deployment Setup Guide

This guide will help you set up automatic deployment from Lovable → GitHub → Hostinger VPS.

## Prerequisites
- Hostinger VPS with Ubuntu/Debian
- Domain name (e.g., www.avs.ma)
- SSH access to your VPS
- GitHub repository connected to Lovable

## Step 1: Prepare Your Hostinger VPS

### 1.1 Connect to your VPS via SSH
```bash
ssh root@your-vps-ip
```

### 1.2 Run the server setup script
Upload and run the `server-setup.sh` script on your VPS:
```bash
wget https://raw.githubusercontent.com/your-username/your-repo/main/server-setup.sh
chmod +x server-setup.sh
sudo ./server-setup.sh
```

### 1.3 Create application directory
```bash
sudo mkdir -p /var/www/avswebsite
sudo chown -R appuser:appuser /var/www/avswebsite
```

## Step 2: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and Variables → Actions

Add these secrets:

### Required Secrets:
- `VPS_HOST`: Your Hostinger VPS IP address
- `VPS_USERNAME`: `appuser` (created by setup script)
- `VPS_SSH_KEY`: Your private SSH key (see Step 3)
- `VITE_SUPABASE_URL`: `https://nkkalmyhxtuisjdjmdew.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `PRODUCTION_URL`: Your website URL (e.g., `https://www.avs.ma`)

## Step 3: Generate SSH Key for Deployment

### 3.1 On your local machine, generate an SSH key pair:
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/hostinger_deploy -N ""
```

### 3.2 Copy the public key to your VPS:
```bash
ssh-copy-id -i ~/.ssh/hostinger_deploy.pub appuser@your-vps-ip
```

### 3.3 Add the private key to GitHub Secrets:
```bash
cat ~/.ssh/hostinger_deploy
```
Copy this entire output and paste it as the `VPS_SSH_KEY` secret in GitHub.

## Step 4: Configure Nginx on VPS

### 4.1 Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/avswebsite
```

Paste the nginx.conf content (update domain name):
```nginx
server {
    listen 80;
    server_name www.avs.ma avs.ma;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.avs.ma avs.ma;

    # SSL Configuration (will be set up by Certbot)
    ssl_certificate /etc/letsencrypt/live/www.avs.ma/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.avs.ma/privkey.pem;

    root /var/www/avswebsite/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff2?|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy to Supabase
    location /api/ {
        proxy_pass https://nkkalmyhxtuisjdjmdew.supabase.co/;
        proxy_set_header Host nkkalmyhxtuisjdjmdew.supabase.co;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 4.2 Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/avswebsite /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 5: Set Up SSL Certificate

### 5.1 Install Certbot (if not already installed):
```bash
sudo apt install certbot python3-certbot-nginx
```

### 5.2 Get SSL certificate:
```bash
sudo certbot --nginx -d www.avs.ma -d avs.ma
```

## Step 6: Initial Repository Setup

### 6.1 Clone your repository:
```bash
sudo -u appuser git clone https://github.com/your-username/your-repo.git /var/www/avswebsite
cd /var/www/avswebsite
```

### 6.2 Install dependencies and build:
```bash
sudo -u appuser npm install
sudo -u appuser npm run build
```

### 6.3 Start with PM2:
```bash
sudo -u appuser pm2 start ecosystem.config.js --env production
sudo -u appuser pm2 save
```

## Step 7: Configure DNS

Point your domain to your Hostinger VPS:

### A Records:
- `@` (root domain) → Your VPS IP
- `www` → Your VPS IP

## Step 8: Test Deployment

Make a small change in Lovable and push to see if automatic deployment works:

1. Edit something in Lovable
2. Changes push to GitHub automatically
3. GitHub Actions builds and deploys
4. Check your website at https://www.avs.ma

## Monitoring and Troubleshooting

### Check deployment logs:
```bash
# GitHub Actions logs (in your repo)
https://github.com/your-username/your-repo/actions

# PM2 logs on VPS
sudo -u appuser pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Restart services if needed:
```bash
# Restart PM2
sudo -u appuser pm2 restart all

# Restart Nginx
sudo systemctl restart nginx
```

## Security Notes

- The VPS is configured with UFW firewall
- Fail2ban is installed for intrusion prevention
- SSH key authentication is required
- SSL certificates are automatically renewed

## Backup Strategy

- Daily automated backups are configured
- Rollback capability in case of failed deployments
- PM2 automatically restarts your application if it crashes

---

**After completing these steps, your workflow will be:**
1. Edit in Lovable
2. Changes automatically sync to GitHub
3. GitHub Actions builds and deploys to your VPS
4. Website is live at https://www.avs.ma

**Need help?** Check the deployment logs or contact support.