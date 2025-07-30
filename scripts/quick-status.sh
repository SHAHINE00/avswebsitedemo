#!/bin/bash

# Quick status check script
# Run this for a fast overview of your system status

echo "🚀 AVS.ma Production Status Overview"
echo "=================================="

# Website status
echo -n "🌐 Website: "
if curl -f -s https://avs.ma > /dev/null 2>&1; then
    echo "✅ ONLINE"
else
    echo "❌ OFFLINE"
fi

# Services status
echo -n "⚙️ Nginx: "
systemctl is-active --quiet nginx && echo "✅ RUNNING" || echo "❌ STOPPED"

echo -n "🔄 PM2: "
if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "online"; then
        echo "✅ RUNNING ($(pm2 list | grep -c "online") processes)"
    else
        echo "⚠️ NO PROCESSES"
    fi
else
    echo "❌ NOT INSTALLED"
fi

# System resources
echo "💾 Disk: $(df -h / | awk 'NR==2 {print $5 " used"}')"
echo "🧠 Memory: $(free -h | awk 'NR==2{printf "%.1f%% used", $3*100/$2}')"
echo "⏱️ Load: $(uptime | awk -F'load average:' '{print $2}' | sed 's/^ *//')"

# Monitoring status
echo -n "📊 Monitoring: "
if [ -f "/var/log/monitoring/uptime.log" ]; then
    echo "✅ ACTIVE ($(wc -l < /var/log/monitoring/uptime.log) uptime checks)"
else
    echo "⚠️ LOGS PENDING"
fi

# Recent errors
echo -n "🚨 Recent Alerts: "
recent_alerts=$(journalctl -t website-monitor -t performance-monitor --since "1 hour ago" --no-pager -q 2>/dev/null | wc -l)
if [ "$recent_alerts" -eq 0 ]; then
    echo "✅ NONE"
else
    echo "⚠️ $recent_alerts in last hour"
fi

echo "=================================="
echo "📅 $(date)"
echo "🔧 For detailed status: ./scripts/verify-setup.sh"