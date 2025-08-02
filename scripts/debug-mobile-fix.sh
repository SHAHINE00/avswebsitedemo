#!/bin/bash

# Debug mobile download issue
# This script helps identify what's causing the mobile download prompt

set -e

echo "🔍 Debugging mobile download issue..."

# Test the headers returned by the server
echo "📋 Testing headers for index.html..."
curl -I https://avs.ma/

echo ""
echo "📋 Testing headers for root path..."
curl -I https://avs.ma

echo ""
echo "📋 Testing User-Agent simulation (mobile)..."
curl -I -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1" https://avs.ma/

echo ""
echo "📋 Testing content type detection..."
curl -s https://avs.ma/ | head -20

echo ""
echo "🔧 Checking nginx configuration status..."
VPS_HOST="213.210.20.104"
VPS_USER="root"

ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
echo "🔍 Checking nginx configuration..."
nginx -t

echo ""
echo "🔍 Checking nginx error logs (last 20 lines)..."
tail -20 /var/log/nginx/avs.ma.error.log

echo ""
echo "🔍 Checking file permissions..."
ls -la /var/www/avswebsite/dist/index.html

echo ""
echo "🔍 Checking mime types..."
grep -E "html|text" /etc/nginx/mime.types | head -5
ENDSSH

echo "✅ Debug complete! Check the output above for issues."