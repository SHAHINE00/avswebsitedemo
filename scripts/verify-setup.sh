#!/bin/bash

# Verification script to test all monitoring and deployment components
# Run this script to verify everything is working correctly

set -e

echo "🔍 Starting comprehensive system verification..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_info() {
    echo -e "ℹ️ $1"
}

echo "==================== SCRIPT VERIFICATION ===================="

# Check if all scripts exist and are executable
echo "📋 Checking deployment scripts..."
for script in deploy-local.sh maintenance.sh setup-monitoring.sh; do
    if [ -f "/var/www/avswebsite/scripts/$script" ] && [ -x "/var/www/avswebsite/scripts/$script" ]; then
        print_status 0 "Script $script exists and is executable"
    else
        print_status 1 "Script $script missing or not executable"
    fi
done

echo "==================== MONITORING VERIFICATION ===================="

# Check monitoring scripts
echo "📊 Checking monitoring scripts..."
if [ -f "/usr/local/bin/check-website.sh" ] && [ -x "/usr/local/bin/check-website.sh" ]; then
    print_status 0 "Website monitoring script installed"
else
    print_status 1 "Website monitoring script missing"
fi

if [ -f "/usr/local/bin/check-performance.sh" ] && [ -x "/usr/local/bin/check-performance.sh" ]; then
    print_status 0 "Performance monitoring script installed"
else
    print_status 1 "Performance monitoring script missing"
fi

# Check monitoring logs directory
if [ -d "/var/log/monitoring" ]; then
    print_status 0 "Monitoring logs directory exists"
else
    print_status 1 "Monitoring logs directory missing"
fi

# Check if bc (calculator) is installed
if command -v bc &> /dev/null; then
    print_status 0 "bc (calculator) is installed"
else
    print_status 1 "bc (calculator) is missing - needed for performance monitoring"
fi

echo "==================== CRON JOBS VERIFICATION ===================="

# Check cron jobs
echo "⏰ Checking cron jobs..."
crontab -l 2>/dev/null | grep -q "check-website.sh" && print_status 0 "Website monitoring cron job active" || print_status 1 "Website monitoring cron job missing"
crontab -l 2>/dev/null | grep -q "check-performance.sh" && print_status 0 "Performance monitoring cron job active" || print_status 1 "Performance monitoring cron job missing"
crontab -l 2>/dev/null | grep -q "maintenance.sh" && print_status 0 "Weekly maintenance cron job active" || print_status 1 "Weekly maintenance cron job missing"

echo "==================== SYSTEM SERVICES VERIFICATION ===================="

# Check essential services
echo "🔍 Checking system services..."
systemctl is-active --quiet nginx && print_status 0 "Nginx is running" || print_status 1 "Nginx is not running"
command -v pm2 &> /dev/null && print_status 0 "PM2 is installed" || print_status 1 "PM2 is not installed"

if command -v pm2 &> /dev/null; then
    pm2 list | grep -q "online" && print_status 0 "PM2 processes are running" || print_warning "No PM2 processes running"
fi

echo "==================== WEBSITE VERIFICATION ===================="

# Test website availability
echo "🌐 Testing website..."
if curl -f -s https://avs.ma > /dev/null 2>&1; then
    print_status 0 "Website https://avs.ma is accessible"
else
    print_status 1 "Website https://avs.ma is not accessible"
fi

echo "==================== MONITORING TEST ===================="

# Test monitoring scripts
echo "🧪 Testing monitoring scripts..."
print_info "Running website check test..."
/usr/local/bin/check-website.sh 2>/dev/null && print_status 0 "Website monitoring script works" || print_status 1 "Website monitoring script failed"

print_info "Running performance check test..."
/usr/local/bin/check-performance.sh 2>/dev/null && print_status 0 "Performance monitoring script works" || print_status 1 "Performance monitoring script failed"

echo "==================== LOG FILES VERIFICATION ===================="

# Check log files
echo "📋 Checking log files..."
if [ -f "/var/log/monitoring/uptime.log" ]; then
    lines=$(wc -l < /var/log/monitoring/uptime.log)
    print_status 0 "Uptime log exists ($lines entries)"
    print_info "Latest uptime entry: $(tail -n 1 /var/log/monitoring/uptime.log 2>/dev/null || echo 'No entries yet')"
else
    print_warning "Uptime log not created yet (will be created by cron job)"
fi

if [ -f "/var/log/monitoring/performance.log" ]; then
    lines=$(wc -l < /var/log/monitoring/performance.log)
    print_status 0 "Performance log exists ($lines entries)"
    print_info "Latest performance entry: $(tail -n 1 /var/log/monitoring/performance.log 2>/dev/null || echo 'No entries yet')"
else
    print_warning "Performance log not created yet (will be created by cron job)"
fi

echo "==================== SYSTEM RESOURCES ===================="

# Show current system status
echo "💾 Current system status:"
echo "Disk usage:"
df -h / | awk 'NR==2 {print "  Root filesystem: " $5 " used (" $3 "/" $2 ")"}'

echo "Memory usage:"
free -h | awk 'NR==2{printf "  Memory: %s/%s (%.1f%% used)\n", $3,$2,$3*100/$2}'

echo "Load average:"
uptime | awk -F'load average:' '{print "  " $2}'

echo "==================== SUMMARY ===================="

echo "🎯 Next steps:"
echo "   1. Monitor logs: tail -f /var/log/monitoring/*.log"
echo "   2. Check alerts: journalctl -t website-monitor -t performance-monitor"
echo "   3. View cron jobs: crontab -l"
echo "   4. Test deployment: cd /var/www/avswebsite && ./scripts/deploy-local.sh"
echo "   5. Run maintenance: ./scripts/maintenance.sh"

echo ""
echo "🎉 Verification completed! Your monitoring and deployment system is ready."