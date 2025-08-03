#!/bin/bash

# Final comprehensive health check for production deployment
# Tests all critical systems and generates deployment report

set -e

echo "🏥 Final Production Health Check"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅${NC} $2"
    else
        echo -e "${RED}❌${NC} $2"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

# Test website accessibility
echo "🌐 Testing Website Accessibility"
echo "-------------------------------"

curl -f -s https://avs.ma > /dev/null 2>&1
print_status $? "Main website (https://avs.ma)"

curl -f -s https://www.avs.ma > /dev/null 2>&1
print_status $? "WWW redirect (https://www.avs.ma)"

# Test mobile viewport
curl -f -s -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_7 like Mac OS X)" https://avs.ma > /dev/null 2>&1
print_status $? "Mobile user agent test"

# Test key pages
for page in "/about" "/curriculum" "/contact" "/blog"; do
    curl -f -s "https://avs.ma${page}" > /dev/null 2>&1
    print_status $? "Page: ${page}"
done

echo ""
echo "🔐 Security & SSL Check"
echo "----------------------"

# Check SSL certificate
ssl_check=$(echo | openssl s_client -servername avs.ma -connect avs.ma:443 2>/dev/null | openssl x509 -noout -dates)
if [[ $ssl_check == *"notAfter"* ]]; then
    print_status 0 "SSL certificate valid"
    echo "   $ssl_check"
else
    print_status 1 "SSL certificate issue"
fi

# Test security headers
security_headers=$(curl -I -s https://avs.ma | grep -E "(X-Frame-Options|X-Content-Type-Options|X-XSS-Protection)")
if [[ -n "$security_headers" ]]; then
    print_status 0 "Security headers present"
else
    print_warning "Some security headers missing"
fi

echo ""
echo "⚙️ Server Status"
echo "---------------"

systemctl is-active --quiet nginx
print_status $? "Nginx service"

if command -v pm2 &> /dev/null; then
    pm2_status=$(pm2 list | grep -c "online" 2>/dev/null || echo "0")
    if [ "$pm2_status" -gt 0 ]; then
        print_status 0 "PM2 processes ($pm2_status running)"
    else
        print_status 1 "No PM2 processes running"
    fi
else
    print_status 1 "PM2 not found"
fi

echo ""
echo "📊 Performance Metrics"
echo "--------------------"

# Check response time
response_time=$(curl -o /dev/null -s -w '%{time_total}' https://avs.ma)
response_ms=$(echo "$response_time * 1000" | bc -l | cut -d. -f1)

if [ "$response_ms" -lt 2000 ]; then
    print_status 0 "Response time: ${response_ms}ms (Good)"
elif [ "$response_ms" -lt 4000 ]; then
    print_warning "Response time: ${response_ms}ms (Acceptable)"
else
    print_status 1 "Response time: ${response_ms}ms (Slow)"
fi

# Check file sizes
html_size=$(curl -s -H "Accept-Encoding: gzip" https://avs.ma | wc -c)
if [ "$html_size" -lt 100000 ]; then
    print_status 0 "HTML size: ${html_size} bytes (Optimized)"
else
    print_warning "HTML size: ${html_size} bytes (Large)"
fi

echo ""
echo "🎯 PWA & Mobile Check"
echo "-------------------"

# Check that manifest.json returns 404 (PWA disabled)
manifest_status=$(curl -s -o /dev/null -w "%{http_code}" https://avs.ma/manifest.json)
if [ "$manifest_status" -eq 404 ]; then
    print_status 0 "PWA disabled (manifest.json returns 404)"
else
    print_warning "Manifest.json accessible (PWA may still be active)"
fi

# Check that sw.js returns 404 (Service worker disabled)
sw_status=$(curl -s -o /dev/null -w "%{http_code}" https://avs.ma/sw.js)
if [ "$sw_status" -eq 404 ]; then
    print_status 0 "Service Worker disabled (sw.js returns 404)"
else
    print_warning "Service Worker accessible (may cause caching issues)"
fi

echo ""
echo "📈 System Resources"
echo "-----------------"

# Disk usage
disk_usage=$(df -h / | awk 'NR==2 {print $5}' | cut -d'%' -f1)
if [ "$disk_usage" -lt 70 ]; then
    print_status 0 "Disk usage: ${disk_usage}% (Good)"
elif [ "$disk_usage" -lt 85 ]; then
    print_warning "Disk usage: ${disk_usage}% (Monitor)"
else
    print_status 1 "Disk usage: ${disk_usage}% (Critical)"
fi

# Memory usage
mem_usage=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
mem_int=$(echo "$mem_usage" | cut -d. -f1)
if [ "$mem_int" -lt 70 ]; then
    print_status 0 "Memory usage: ${mem_usage}% (Good)"
elif [ "$mem_int" -lt 85 ]; then
    print_warning "Memory usage: ${mem_usage}% (Monitor)"
else
    print_status 1 "Memory usage: ${mem_usage}% (Critical)"
fi

echo ""
echo "🔍 Monitoring Status"
echo "------------------"

if [ -f "/var/log/monitoring/uptime.log" ]; then
    uptime_entries=$(wc -l < /var/log/monitoring/uptime.log)
    print_status 0 "Uptime monitoring active ($uptime_entries checks logged)"
else
    print_status 1 "Uptime monitoring not configured"
fi

if [ -f "/var/log/monitoring/performance.log" ]; then
    perf_entries=$(wc -l < /var/log/monitoring/performance.log)
    print_status 0 "Performance monitoring active ($perf_entries checks logged)"
else
    print_status 1 "Performance monitoring not configured"
fi

# Check cron jobs
cron_jobs=$(crontab -l 2>/dev/null | grep -c "/usr/local/bin/check-" || echo "0")
if [ "$cron_jobs" -gt 0 ]; then
    print_status 0 "Monitoring cron jobs active ($cron_jobs jobs)"
else
    print_status 1 "No monitoring cron jobs found"
fi

echo ""
echo "🎉 DEPLOYMENT SUMMARY"
echo "===================="

# Overall health score
total_checks=15
passed_checks=0

# Count successful checks (this is simplified - in production you'd track each check)
if curl -f -s https://avs.ma > /dev/null 2>&1; then ((passed_checks++)); fi
if systemctl is-active --quiet nginx; then ((passed_checks++)); fi
if pm2 list | grep -q "online"; then ((passed_checks++)); fi
if [ "$response_ms" -lt 2000 ]; then ((passed_checks++)); fi
if [ "$disk_usage" -lt 80 ]; then ((passed_checks++)); fi
if [ "$mem_int" -lt 80 ]; then ((passed_checks++)); fi
if [ "$manifest_status" -eq 404 ]; then ((passed_checks++)); fi
if [ "$sw_status" -eq 404 ]; then ((passed_checks++)); fi

health_score=$((passed_checks * 100 / 8))

echo "🏥 Overall Health Score: ${health_score}%"
echo "📅 Checked on: $(date)"
echo "🌐 Website: https://avs.ma"
echo "📊 Monitoring: /var/log/monitoring/"

if [ "$health_score" -ge 90 ]; then
    echo -e "${GREEN}🎯 EXCELLENT - Production ready!${NC}"
elif [ "$health_score" -ge 75 ]; then
    echo -e "${YELLOW}✅ GOOD - Minor optimizations recommended${NC}"
else
    echo -e "${RED}⚠️ ATTENTION NEEDED - Review failed checks${NC}"
fi

echo ""
echo "🔧 Quick Commands:"
echo "  Status check: ./scripts/quick-status.sh"
echo "  Maintenance:  ./scripts/maintenance.sh"
echo "  Monitoring:   journalctl -t website-monitor -t performance-monitor"