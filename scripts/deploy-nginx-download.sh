#!/bin/bash

# Deploy nginx brochure download fix to VPS
# This script uploads the updated nginx.conf, tests it, restarts nginx, and verifies headers

set -e

echo "🚀 Deploying Nginx brochure download fix..."

# Configuration
VPS_HOST="213.210.20.104"
VPS_USER="root"
NGINX_CONF_REMOTE="/etc/nginx/sites-available/avs.ma.conf"
NGINX_CONF_LOCAL="nginx.conf"
BACKUP_DIR="/etc/nginx/backups"

# CPAE programme PDF paths (optional local upload)
PROGRAM_PDF_LOCAL="public/documents/programme-cpae.pdf"
PROGRAM_PDF_REMOTE="/var/www/avswebsite/dist/documents/programme-cpae.pdf"

# Step 1: Backup current config on VPS
echo "📋 Creating backup of current nginx config..."
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
mkdir -p /etc/nginx/backups
BACKUP_FILE="/etc/nginx/backups/avs.ma.conf.$(date +%Y%m%d_%H%M%S).backup"
if [ -f /etc/nginx/sites-available/avs.ma.conf ]; then
    cp /etc/nginx/sites-available/avs.ma.conf "$BACKUP_FILE"
    echo "✅ Backup created: $BACKUP_FILE"
else
    echo "⚠️  No existing config found, will create new one"
fi
ENDSSH

# Step 2: Upload new nginx.conf
echo "📤 Uploading updated nginx.conf..."
scp ${NGINX_CONF_LOCAL} ${VPS_USER}@${VPS_HOST}:${NGINX_CONF_REMOTE}

# Step 3: Ensure CPAE program PDF exists on server (if available locally)
echo "🗂️ Ensuring programme-cpae.pdf is present on server..."
if [ -f "${PROGRAM_PDF_LOCAL}" ]; then
  ssh ${VPS_USER}@${VPS_HOST} "mkdir -p /var/www/avswebsite/dist/documents"
  scp ${PROGRAM_PDF_LOCAL} ${VPS_USER}@${VPS_HOST}:${PROGRAM_PDF_REMOTE}
  echo "✅ Uploaded programme-cpae.pdf to ${PROGRAM_PDF_REMOTE}"
else
  echo "⚠️ Local ${PROGRAM_PDF_LOCAL} not found. Skipping PDF upload."
fi

# Step 4: Ensure avs.ma.conf is enabled and test nginx
echo "🔧 Enabling site and testing nginx configuration..."
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
# Remove default site if it exists
rm -f /etc/nginx/sites-enabled/default.conf
rm -f /etc/nginx/sites-enabled/default

# Ensure our site is enabled
ln -sf /etc/nginx/sites-available/avs.ma.conf /etc/nginx/sites-enabled/avs.ma.conf

# Test nginx config
echo "🧪 Testing nginx configuration..."
if ! nginx -t; then
    echo "❌ Nginx configuration test failed!"
    echo "🔄 Restoring backup..."
    LATEST_BACKUP=$(ls -t /etc/nginx/backups/avs.ma.conf.*.backup | head -1)
    if [ -n "$LATEST_BACKUP" ]; then
        cp "$LATEST_BACKUP" /etc/nginx/sites-available/avs.ma.conf
        echo "✅ Backup restored"
    fi
    exit 1
fi

echo "✅ Nginx configuration test passed"
ENDSSH

# Step 4: Restart nginx
echo "🔄 Restarting nginx..."
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
systemctl restart nginx
echo "✅ Nginx restarted successfully"
ENDSSH

# Step 5: Wait for nginx to fully restart
echo "⏳ Waiting for nginx to stabilize..."
sleep 3

# Step 6: Verify headers with curl (200 OK response - brochure)
echo ""
echo "🧪 Testing headers for 200 OK response (brochure)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -I https://avs.ma/download/brochure.pdf | head -15
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 6b: Verify headers with curl (200 OK response - programme)
echo ""
echo "🧪 Testing headers for 200 OK response (programme-cpae)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -I https://avs.ma/download/programme-cpae.pdf | head -15
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 7: Verify headers with Range request (206 Partial Content - iOS Safari behavior, brochure)
echo ""
echo "🧪 Testing headers for 206 Partial Content (brochure)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -I -H "Range: bytes=0-1023" https://avs.ma/download/brochure.pdf | head -15
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 7b: Verify headers with Range request (206 Partial Content - programme)
echo ""
echo "🧪 Testing headers for 206 Partial Content (programme-cpae)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -I -H "Range: bytes=0-1023" https://avs.ma/download/programme-cpae.pdf | head -15
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 8: Check for critical headers (brochure)
echo ""
echo "🔍 Checking critical headers (brochure)..."
echo ""
echo "📋 Checking 200 OK response:"
HEADERS_200_BROCHURE=$(curl -s -I https://avs.ma/download/brochure.pdf)
if echo "$HEADERS_200_BROCHURE" | grep -qi "content-disposition.*attachment"; then
    echo "✅ Content-Disposition header found (200 OK)"
else
    echo "❌ Content-Disposition header missing (200 OK)"
fi

if echo "$HEADERS_200_BROCHURE" | grep -qi "content-type.*octet-stream"; then
    echo "✅ Content-Type is application/octet-stream (200 OK)"
else
    echo "⚠️  Content-Type might not be octet-stream (200 OK)"
fi

echo ""
echo "📋 Checking 206 Partial Content response:"
HEADERS_206_BROCHURE=$(curl -s -I -H "Range: bytes=0-1023" https://avs.ma/download/brochure.pdf)
if echo "$HEADERS_206_BROCHURE" | grep -qi "content-disposition.*attachment"; then
    echo "✅ Content-Disposition header found (206 Partial Content) - iOS Safari should download!"
else
    echo "❌ Content-Disposition header missing (206 Partial Content) - iOS Safari will open inline!"
fi

if echo "$HEADERS_206_BROCHURE" | grep -qi "content-type.*octet-stream"; then
    echo "✅ Content-Type is application/octet-stream (206 Partial Content)"
else
    echo "⚠️  Content-Type might not be octet-stream (206 Partial Content)"
fi

# Step 8b: Check for critical headers (programme)
echo ""
echo "🔍 Checking critical headers (programme-cpae)..."
echo ""
echo "📋 Checking 200 OK response:"
HEADERS_200_PROGRAM=$(curl -s -I https://avs.ma/download/programme-cpae.pdf)
if echo "$HEADERS_200_PROGRAM" | grep -qi "content-disposition.*attachment"; then
    echo "✅ Content-Disposition header found (200 OK)"
else
    echo "❌ Content-Disposition header missing (200 OK)"
fi

if echo "$HEADERS_200_PROGRAM" | grep -qi "content-type.*octet-stream"; then
    echo "✅ Content-Type is application/octet-stream (200 OK)"
else
    echo "⚠️  Content-Type might not be octet-stream (200 OK)"
fi

echo ""
echo "📋 Checking 206 Partial Content response:"
HEADERS_206_PROGRAM=$(curl -s -I -H "Range: bytes=0-1023" https://avs.ma/download/programme-cpae.pdf)
if echo "$HEADERS_206_PROGRAM" | grep -qi "content-disposition.*attachment"; then
    echo "✅ Content-Disposition header found (206 Partial Content) - iOS Safari should download!"
else
    echo "❌ Content-Disposition header missing (206 Partial Content) - iOS Safari will open inline!"
fi

if echo "$HEADERS_206_PROGRAM" | grep -qi "content-type.*octet-stream"; then
    echo "✅ Content-Type is application/octet-stream (206 Partial Content)"
else
    echo "⚠️  Content-Type might not be octet-stream (206 Partial Content)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deployment complete!"
echo ""
echo "📱 Testing checklist:"
echo "  1. Desktop: Visit https://avs.ma/download/brochure.pdf - should download directly"
echo "  2. iOS Safari: Tap 'Télécharger la Brochure Gratuite' - should prompt download/save"
echo "  3. If issues persist, check the headers above for Content-Disposition on 206 responses"
echo ""
echo "🔗 Direct link: https://avs.ma/download/brochure.pdf"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
