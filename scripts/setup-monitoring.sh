#!/bin/bash

# Setup monitoring and alerts for your VPS
# This script sets up basic monitoring using built-in tools

set -e

echo "📊 Setting up monitoring and alerts..."

# Create monitoring directory
mkdir -p /var/log/monitoring

# Create uptime monitoring script
cat > /usr/local/bin/check-website.sh << 'EOF'
#!/bin/bash
URL="https://avs.ma"
LOG_FILE="/var/log/monitoring/uptime.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

if curl -f $URL > /dev/null 2>&1; then
    echo "$TIMESTAMP - ✅ Website is UP" >> $LOG_FILE
else
    echo "$TIMESTAMP - ❌ Website is DOWN" >> $LOG_FILE
    # Send alert (you can add email notification here)
    echo "ALERT: Website $URL is down at $TIMESTAMP" | logger -t website-monitor
fi
EOF

chmod +x /usr/local/bin/check-website.sh

# Create performance monitoring script
cat > /usr/local/bin/check-performance.sh << 'EOF'
#!/bin/bash
LOG_FILE="/var/log/monitoring/performance.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Check CPU usage
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)

# Check memory usage
MEM_USAGE=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')

# Check disk usage
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | cut -d'%' -f1)

# Log performance metrics
echo "$TIMESTAMP - CPU: ${CPU_USAGE}%, Memory: ${MEM_USAGE}%, Disk: ${DISK_USAGE}%" >> $LOG_FILE

# Alert if usage is high
if (( $(echo "$CPU_USAGE > 80" | bc -l) )); then
    echo "ALERT: High CPU usage: ${CPU_USAGE}%" | logger -t performance-monitor
fi

if (( $(echo "$MEM_USAGE > 85" | bc -l) )); then
    echo "ALERT: High Memory usage: ${MEM_USAGE}%" | logger -t performance-monitor
fi

if [ "$DISK_USAGE" -gt 85 ]; then
    echo "ALERT: High Disk usage: ${DISK_USAGE}%" | logger -t performance-monitor
fi
EOF

chmod +x /usr/local/bin/check-performance.sh

# Setup cron jobs for monitoring
echo "⏰ Setting up cron jobs..."

# Check website every 5 minutes
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/check-website.sh") | crontab -

# Check performance every 15 minutes
(crontab -l 2>/dev/null; echo "*/15 * * * * /usr/local/bin/check-performance.sh") | crontab -

# Run maintenance script weekly (Sunday at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * 0 /var/www/avswebsite/scripts/maintenance.sh >> /var/log/maintenance.log 2>&1") | crontab -

# Create log rotation for monitoring logs
cat > /etc/logrotate.d/monitoring << 'EOF'
/var/log/monitoring/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
}
EOF

echo "✅ Monitoring setup completed!"
echo "📊 Logs will be available in /var/log/monitoring/"
echo "🔔 Alerts will be sent to system log (viewable with: journalctl -t website-monitor -t performance-monitor)"
echo "⏰ Automatic maintenance will run every Sunday at 2 AM"