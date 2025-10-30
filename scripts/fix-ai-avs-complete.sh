#!/bin/bash
set -e

echo "🚀 Complete Fix for ai.avs.ma + avs.ma Deployment"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# =======================
# PART 0: Fix Ollama Systemd (Optional)
# =======================
echo -e "${YELLOW}PART 0: Check Ollama Service${NC}"
echo "------------------------------"
echo ""
echo "Would you like to fix Ollama systemd service first?"
echo "This will ensure Ollama runs reliably under systemd."
echo ""
echo "Options:"
echo "  1) Install native binary (recommended - /usr/local/bin/ollama)"
echo "  2) Use existing snap installation (/snap/bin/ollama)"
echo "  3) Skip Ollama fix (proceed to Nginx config only)"
echo ""
read -p "Enter choice [1-3]: " OLLAMA_CHOICE

case $OLLAMA_CHOICE in
  1)
    echo ""
    echo "Running Ollama systemd fix (native binary)..."
    if [ -f "./fix-ollama-systemd.sh" ]; then
      bash ./fix-ollama-systemd.sh
    elif [ -f "/root/fix-ollama-systemd.sh" ]; then
      bash /root/fix-ollama-systemd.sh
    else
      echo -e "${RED}❌ fix-ollama-systemd.sh not found!${NC}"
      echo "Please run it separately or continue with Nginx fix only."
      read -p "Continue anyway? [y/N]: " CONTINUE
      if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
        exit 1
      fi
    fi
    ;;
  2)
    echo ""
    echo "Running Ollama systemd fix (using snap)..."
    if [ -f "./fix-ollama-systemd.sh" ]; then
      bash ./fix-ollama-systemd.sh --use-snap
    elif [ -f "/root/fix-ollama-systemd.sh" ]; then
      bash /root/fix-ollama-systemd.sh --use-snap
    else
      echo -e "${RED}❌ fix-ollama-systemd.sh not found!${NC}"
      echo "Please run it separately or continue with Nginx fix only."
      read -p "Continue anyway? [y/N]: " CONTINUE
      if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
        exit 1
      fi
    fi
    ;;
  3)
    echo "Skipping Ollama systemd fix..."
    ;;
  *)
    echo -e "${RED}Invalid choice. Exiting.${NC}"
    exit 1
    ;;
esac

echo ""

# =======================
# PART A: Fix ai.avs.ma
# =======================
echo -e "${YELLOW}PART A: Fixing ai.avs.ma Nginx Configuration${NC}"
echo "---------------------------------------------"

# Backup current config
echo "📋 Backing up current ai.avs.ma config..."
sudo cp /etc/nginx/sites-available/ai.avs.ma.conf /etc/nginx/sites-available/ai.avs.ma.conf.backup-$(date +%Y%m%d-%H%M%S) 2>/dev/null || echo "No existing config to backup"

# Write minimal, working config
echo "✍️  Writing minimal Nginx config..."
sudo bash -c 'cat > /etc/nginx/sites-available/ai.avs.ma.conf << "EOF"
# Minimal working config for Ollama proxy
# No Cloudflare/IP restrictions; just proxy /api/* to local Ollama

# HTTP -> HTTPS
server {
  listen 80;
  listen [::]:80;
  server_name ai.avs.ma;
  return 301 https://$host$request_uri;
}

# HTTPS
server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name ai.avs.ma;

  # SSL certificates
  ssl_certificate /etc/letsencrypt/live/avs.ma/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/avs.ma/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_prefer_server_ciphers off;
  ssl_session_cache shared:SSL:10m;
  ssl_session_timeout 10m;

  # Basic security headers
  add_header X-Frame-Options "DENY" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

  # Health check endpoint
  location = /api/version {
    proxy_pass http://127.0.0.1:11434/api/version;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    add_header Access-Control-Allow-Origin "*" always;
  }

  # Proxy all Ollama API routes
  location /api/ {
    proxy_pass http://127.0.0.1:11434/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # Long-running AI responses
    proxy_buffering off;
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;
    proxy_connect_timeout 60s;
    client_max_body_size 10m;

    # CORS headers
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
    
    if ($request_method = OPTIONS) {
      return 204;
    }
  }

  # Everything else returns 404
  location / {
    return 404;
  }

  # Logs
  access_log /var/log/nginx/ollama-ai.access.log;
  error_log  /var/log/nginx/ollama-ai.error.log;
}
EOF'

echo "✅ Config written"

# Enable site
echo "🔗 Enabling site..."
sudo ln -sf /etc/nginx/sites-available/ai.avs.ma.conf /etc/nginx/sites-enabled/ai.avs.ma.conf

# Test config
echo "🧪 Testing Nginx configuration..."
if sudo nginx -t 2>&1 | grep -q "test is successful"; then
  echo -e "${GREEN}✅ Nginx config is valid${NC}"
else
  echo -e "${RED}❌ Nginx config test failed!${NC}"
  echo "Restoring backup..."
  sudo cp /etc/nginx/sites-available/ai.avs.ma.conf.backup-* /etc/nginx/sites-available/ai.avs.ma.conf 2>/dev/null | tail -1 || true
  exit 1
fi

# Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx
echo -e "${GREEN}✅ Nginx reloaded${NC}"

# Test endpoints
echo ""
echo "🧪 Testing ai.avs.ma endpoints..."
echo "Test 1: Local resolve (https://ai.avs.ma/api/version)"
LOCAL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --resolve ai.avs.ma:443:127.0.0.1 https://ai.avs.ma/api/version 2>/dev/null || echo "000")
echo "Status: $LOCAL_STATUS"

echo "Test 2: External HTTPS (https://ai.avs.ma/api/version)"
EXTERNAL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://ai.avs.ma/api/version 2>/dev/null || echo "000")
echo "Status: $EXTERNAL_STATUS"

if [ "$LOCAL_STATUS" = "200" ] && [ "$EXTERNAL_STATUS" = "200" ]; then
  echo -e "${GREEN}✅ ai.avs.ma API is working!${NC}"
else
  echo -e "${YELLOW}⚠️  ai.avs.ma API still returning errors${NC}"
  echo "Checking for Cloudflare IP restrictions..."
  if grep -q "cloudflare/ips" /etc/nginx/nginx.conf 2>/dev/null; then
    echo -e "${YELLOW}Found Cloudflare IP restrictions in nginx.conf${NC}"
    echo "You may need to disable Cloudflare proxy (orange cloud -> grey cloud) for ai.avs.ma"
  fi
fi

echo ""

# =======================
# PART B: Update avs.ma
# =======================
echo -e "${YELLOW}PART B: Updating Main Website (avs.ma)${NC}"
echo "---------------------------------------"

# Check if directory exists
if [ ! -d "/var/www/avswebsite" ]; then
  echo -e "${RED}❌ Directory /var/www/avswebsite not found!${NC}"
  exit 1
fi

cd /var/www/avswebsite

# Git status
echo "📋 Checking git status..."
git status

# Pull latest
echo "📥 Pulling latest code..."
if git pull --rebase; then
  echo -e "${GREEN}✅ Code updated${NC}"
else
  echo -e "${YELLOW}⚠️  Git pull failed, continuing anyway...${NC}"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build
echo "🔨 Building application..."
if npm run build; then
  echo -e "${GREEN}✅ Build successful${NC}"
else
  echo -e "${RED}❌ Build failed!${NC}"
  exit 1
fi

# Set permissions
echo "🔒 Setting permissions..."
chown -R appuser:www-data /var/www/avswebsite 2>/dev/null || chown -R www-data:www-data /var/www/avswebsite
chmod -R 755 /var/www/avswebsite

# Reload Nginx
echo "🔄 Reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx

# Restart PM2 if it exists
if command -v pm2 &> /dev/null; then
  echo "🔄 Restarting PM2..."
  pm2 restart all || pm2 reload all || echo "PM2 restart skipped"
  pm2 save || echo "PM2 save skipped"
fi

echo -e "${GREEN}✅ Main website updated${NC}"

# Test main site
echo ""
echo "🧪 Testing main site..."
MAIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://avs.ma 2>/dev/null || echo "000")
echo "Status: $MAIN_STATUS"

if [ "$MAIN_STATUS" = "200" ]; then
  echo -e "${GREEN}✅ avs.ma is accessible${NC}"
else
  echo -e "${RED}❌ avs.ma returned $MAIN_STATUS${NC}"
fi

echo ""

# =======================
# FINAL VERIFICATION
# =======================
echo -e "${YELLOW}PART C: Final Verification${NC}"
echo "---------------------------"

echo "✅ Deployment complete!"
echo ""
echo "📋 Summary:"
echo "  - ai.avs.ma/api/version: $EXTERNAL_STATUS"
echo "  - avs.ma: $MAIN_STATUS"
echo ""
echo "🧪 Next steps:"
echo "  1. Test chatbot at https://avs.ma"
echo "  2. Check Supabase logs if chatbot fails:"
echo "     https://supabase.com/dashboard/project/nkkalmyhxtuisjdjmdew/functions/ollama-chat/logs"
echo "  3. If ai.avs.ma still returns 403:"
echo "     - Check Cloudflare DNS settings (should be DNS only, not proxied)"
echo "     - Check for Cloudflare IP restrictions: grep -R 'cloudflare/ips' /etc/nginx"
echo ""
