# VPS Deployment Guide

This guide will help you deploy your Education Platform to a VPS server with automatic updates from GitHub.

## Quick Start

1. **Server Setup**: Run the setup script on your VPS
2. **GitHub Integration**: Configure automated deployments
3. **Domain Configuration**: Point your domain to the VPS
4. **SSL Setup**: Configure HTTPS with Let's Encrypt
5. **Go Live**: Deploy and monitor your application

## Prerequisites

- VPS server (Ubuntu 20.04+ recommended)
- Domain name pointing to your VPS IP
- GitHub repository connected to Lovable
- Basic command line knowledge

## Step 1: Server Preparation

### Server Requirements
- **CPU**: 2+ cores
- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 20GB+ SSD
- **OS**: Ubuntu 20.04 LTS or newer

### Initial Setup
```bash
# Connect to your VPS
ssh root@your-server-ip

# Download and run the setup script
wget https://raw.githubusercontent.com/your-username/your-repo/main/server-setup.sh
chmod +x server-setup.sh
sudo ./server-setup.sh
```

## Step 2: GitHub Configuration

### Repository Setup
1. Ensure your Lovable project is connected to GitHub
2. Add the SSH deploy key (generated during setup) to your GitHub repository:
   - Go to Settings → Deploy Keys
   - Add the public key from `/home/appuser/.ssh/github_deploy.pub`
   - Enable write access

### GitHub Secrets
Add these secrets to your GitHub repository (Settings → Secrets):
```
VPS_HOST=your-server-ip
VPS_USERNAME=appuser
VPS_SSH_KEY=your-private-ssh-key
VITE_SUPABASE_URL=https://nkkalmyhxtuisjdjmdew.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
PRODUCTION_URL=https://your-domain.com
```

## Step 3: Application Deployment

### Clone Repository
```bash
# Switch to app user
sudo -u appuser -i

# Clone your repository
git clone git@github.com:your-username/your-repo.git /var/www/your-app
cd /var/www/your-app

# Install dependencies and build
npm install
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
```

## Step 4: Nginx Configuration

### Update Nginx Config
```bash
# Edit nginx configuration
sudo nano /etc/nginx/sites-available/your-app

# Copy the content from nginx.conf file
# Replace 'your-domain.com' with your actual domain

# Enable the site
sudo ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 5: SSL Certificate

### Get SSL Certificate
```bash
# Install SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## Step 6: Environment Configuration

### Production Environment
```bash
# Create production environment file
cd /var/www/your-app
cp .env.production.template .env.production

# Edit with your values
nano .env.production
```

## Deployment Workflow

### Automatic Updates
Once configured, updates work automatically:

1. **Make changes in Lovable** → Changes push to GitHub
2. **GitHub Actions trigger** → Builds and tests your app
3. **Deploy to VPS** → Updates your live site
4. **Health checks** → Ensures everything works
5. **Rollback if needed** → Automatic recovery

### Manual Deployment
```bash
# Run deployment script
cd /var/www/your-app
./deploy.sh production
```

## Monitoring & Maintenance

### Check Application Status
```bash
# PM2 status
pm2 status
pm2 logs

# Nginx status
sudo systemctl status nginx
sudo nginx -t

# System resources
htop
df -h
```

### Log Files
- Application logs: `/var/log/pm2/`
- Nginx logs: `/var/log/nginx/`
- Deployment logs: `/var/log/deploy.log`

### Backup & Recovery
- Automatic backups before each deployment
- Backups stored in `/var/backups/your-app/`
- Rollback with: `./deploy.sh rollback`

## Security Features

### Included Security Measures
- ✅ HTTPS with auto-renewal
- ✅ Security headers configured
- ✅ Rate limiting enabled
- ✅ Firewall (UFW) configured
- ✅ Fail2ban for intrusion prevention
- ✅ SSH key-only authentication

### Additional Security (Recommended)
- Regular system updates
- Monitor logs for suspicious activity
- Use strong passwords/keys
- Regular security audits
- Backup strategy

## Troubleshooting

### Common Issues

**Build Fails**
```bash
# Check build logs
npm run build
# Check dependencies
npm audit fix
```

**Site Not Loading**
```bash
# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Check PM2
pm2 status
pm2 restart all
```

**SSL Issues**
```bash
# Renew certificate
sudo certbot renew
sudo systemctl reload nginx
```

### Performance Optimization

**Enable Caching**
- Browser caching (configured in nginx.conf)
- Gzip compression enabled
- Static asset optimization

**Monitor Performance**
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Check system resources
htop          # CPU and memory
iotop         # Disk I/O
nethogs       # Network usage
```

## Cost Estimation

### Monthly Costs
- **VPS Hosting**: $10-30/month (depending on specs)
- **Domain**: $10-15/year
- **SSL Certificate**: Free (Let's Encrypt)
- **Total**: ~$15-35/month

### Scaling Options
- Upgrade server resources as needed
- Add load balancer for high traffic
- CDN integration for global performance
- Database optimization

## Support

### Getting Help
- Check logs first: `pm2 logs` and `/var/log/nginx/error.log`
- Test configuration: `sudo nginx -t`
- Restart services: `pm2 restart all` and `sudo systemctl reload nginx`
- Review this guide for common solutions

### Updates
- System updates: `sudo apt update && sudo apt upgrade`
- Application updates: Automatic via GitHub
- Security patches: Enable unattended-upgrades

---

This deployment setup gives you a production-ready platform with automatic updates, security, monitoring, and professional performance. Your users will have a fast, secure experience while you maintain full control over your hosting environment.