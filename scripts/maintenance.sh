#!/bin/bash

# Maintenance script for regular server upkeep
# Run this script periodically to maintain optimal performance

set -e

echo "🔧 Starting maintenance tasks..."

# Update system packages (Ubuntu/Debian)
echo "📦 Updating system packages..."
apt update && apt upgrade -y || echo "⚠️ Could not update system packages (check permissions)"

# Update Node.js dependencies
echo "📦 Updating Node.js dependencies..."
cd /var/www/avswebsite
npm ci
npm audit fix --audit-level moderate || echo "⚠️ Some vulnerabilities require manual review"
npx update-browserslist-db@latest || echo "⚠️ Could not update browserslist data"

# Clean up old files and logs
echo "🧹 Cleaning up old files..."
find /var/www/avswebsite -name "*.log" -mtime +7 -delete || true
find /var/www/avswebsite/node_modules -name "*.cache" -type d -exec rm -rf {} + 2>/dev/null || true
npm cache clean --force || true

# Clean PM2 logs
echo "🧹 Cleaning PM2 logs..."
pm2 flush || true

# Check disk space
echo "💾 Checking disk space..."
df -h | grep -E '^/dev/' | awk '{ 
  if($5 > 80) 
    print "⚠️ Warning: " $1 " is " $5 " full" 
  else 
    print "✅ " $1 " has " $5 " used"
}'

# Check memory usage
echo "🧠 Checking memory usage..."
free -h | awk 'NR==2{printf "Memory Usage: %s/%s (%.2f%%)\n", $3,$2,$3*100/$2 }'

# Check service status
echo "🔍 Checking service status..."
systemctl is-active --quiet nginx && echo "✅ Nginx is running" || echo "❌ Nginx is not running"
pm2 list | grep -q "online" && echo "✅ PM2 processes are running" || echo "❌ PM2 processes are not running"

# Test website availability
echo "🌐 Testing website availability..."
curl -f https://avs.ma > /dev/null 2>&1 && echo "✅ Website is accessible" || echo "❌ Website is not accessible"

# Generate simple report
echo "📊 Maintenance completed at $(date)"
echo "🎉 All maintenance tasks finished!"