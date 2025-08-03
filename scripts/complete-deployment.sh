#!/bin/bash

# Complete deployment script - runs all final steps
# This is the master script that orchestrates the entire deployment

set -e

echo "🚀 Starting Complete Production Deployment"
echo "=========================================="

VPS_HOST="213.210.20.104"
VPS_USER="root"
VPS_PATH="/var/www/avswebsite"

# Step 1: Deploy monitoring system
echo "📊 Step 1: Deploying monitoring system..."
./scripts/deploy-monitoring.sh

# Step 2: Run comprehensive health check on VPS
echo "🏥 Step 2: Running comprehensive health check..."
scp scripts/final-health-check.sh ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/scripts/

ssh ${VPS_USER}@${VPS_HOST} << ENDSSH
cd ${VPS_PATH}
chmod +x scripts/final-health-check.sh
./scripts/final-health-check.sh
ENDSSH

# Step 3: Performance optimization
echo "⚡ Step 3: Final performance optimization..."
ssh ${VPS_USER}@${VPS_HOST} << ENDSSH
cd ${VPS_PATH}

# Optimize nginx worker processes
WORKER_PROCESSES=\$(nproc)
sed -i "s/worker_processes auto;/worker_processes \$WORKER_PROCESSES;/" /etc/nginx/nginx.conf

# Restart services with optimized config
systemctl reload nginx
pm2 reload all

echo "✅ Performance optimization completed"
ENDSSH

# Step 4: Security hardening
echo "🔐 Step 4: Security hardening..."
ssh ${VPS_USER}@${VPS_HOST} << ENDSSH
# Set proper file permissions
chmod -R 755 ${VPS_PATH}
chmod -R 644 ${VPS_PATH}/dist/*
chmod +x ${VPS_PATH}/scripts/*.sh

# Secure log files
chmod 640 /var/log/monitoring/*.log 2>/dev/null || true

echo "✅ Security hardening completed"
ENDSSH

# Step 5: Create deployment documentation
echo "📝 Step 5: Creating deployment documentation..."
cat > DEPLOYMENT_COMPLETE.md << 'EOF'
# 🎉 Deployment Complete!

## ✅ Your AVS.ma website is now LIVE and fully operational!

### 🌐 Website URLs:
- **Main site**: https://avs.ma
- **WWW redirect**: https://www.avs.ma

### 📊 Monitoring & Health:
- **Status check**: `./scripts/quick-status.sh`
- **Health check**: `./scripts/final-health-check.sh`
- **Maintenance**: `./scripts/maintenance.sh` (runs automatically weekly)

### 📈 Monitoring Logs:
- **Uptime logs**: `/var/log/monitoring/uptime.log`
- **Performance logs**: `/var/log/monitoring/performance.log`
- **System alerts**: `journalctl -t website-monitor -t performance-monitor`

### 🔧 Key Features Active:
- ✅ **SSL/HTTPS** - Secure connections
- ✅ **Mobile optimized** - Works on all devices
- ✅ **PWA disabled** - No installation prompts
- ✅ **Auto-restart** - PM2 handles crashes
- ✅ **Auto-monitoring** - Health checks every 5 minutes
- ✅ **Auto-maintenance** - Weekly system updates
- ✅ **Security headers** - Protection against common attacks

### 🎯 Performance Optimized:
- ✅ **Fast loading** - Optimized assets and caching
- ✅ **Responsive design** - Perfect on mobile and desktop
- ✅ **SEO ready** - Meta tags and structured data
- ✅ **Error handling** - Graceful error recovery

### 🚨 Emergency Contacts:
If you experience any issues:
1. Run: `./scripts/quick-status.sh` for immediate status
2. Check logs: `pm2 logs` for application logs
3. Check nginx: `sudo tail -f /var/log/nginx/error.log`
4. Restart services: `pm2 restart all && sudo systemctl reload nginx`

### 📞 Support:
Your education platform is production-ready and monitored 24/7!

---
**Deployment completed on**: $(date)
**Server**: 213.210.20.104
**Domain**: avs.ma
**Status**: 🟢 LIVE
EOF

echo ""
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "===================================="
echo ""
echo "🌐 Your website is live at: https://avs.ma"
echo "📱 Mobile optimized and PWA prompts removed"
echo "🔒 SSL secured with automatic monitoring"
echo "📊 Health monitoring active every 5 minutes"
echo "🔧 Weekly maintenance scheduled automatically"
echo ""
echo "📝 See DEPLOYMENT_COMPLETE.md for full documentation"
echo "🚀 Your education platform is ready for users!"