#!/bin/bash

# Fix Ollama Systemd Service
# Run on VPS as root: sudo bash fix-ollama-systemd.sh

set -e

echo "🔧 Fixing Ollama Systemd Service..."
echo "================================================"

# Check root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root: sudo bash fix-ollama-systemd.sh"
    exit 1
fi

# Step 1: Find Ollama binary
echo ""
echo "📍 Step 1: Locating Ollama binary..."
OLLAMA_PATH=$(command -v ollama || echo "")

if [ -z "$OLLAMA_PATH" ]; then
    echo "❌ Ollama binary not found. Installing..."
    curl -fsSL https://ollama.com/install.sh | sh
    OLLAMA_PATH=$(command -v ollama)
fi

echo "✅ Ollama found at: $OLLAMA_PATH"

# Step 2: Check if ollama is already running
echo ""
echo "🔍 Step 2: Checking for running Ollama processes..."
OLLAMA_PID=$(pgrep -f "ollama serve" || echo "")

if [ -n "$OLLAMA_PID" ]; then
    echo "⚠️  Found running Ollama process (PID: $OLLAMA_PID)"
    echo "   Stopping it to allow systemd to manage..."
    kill -9 $OLLAMA_PID 2>/dev/null || true
    sleep 2
fi

# Check port 11434
PORT_PID=$(lsof -ti:11434 || echo "")
if [ -n "$PORT_PID" ]; then
    echo "⚠️  Port 11434 in use by PID: $PORT_PID"
    kill -9 $PORT_PID 2>/dev/null || true
    sleep 2
fi

echo "✅ Port 11434 is free"

# Step 3: Create ollama user (if doesn't exist)
echo ""
echo "👤 Step 3: Setting up ollama user..."
if ! id -u ollama >/dev/null 2>&1; then
    useradd -r -s /bin/false -d /usr/share/ollama -m ollama
    echo "✅ Created ollama user"
else
    echo "✅ ollama user already exists"
fi

# Step 4: Ensure ollama binary is executable
echo ""
echo "🔐 Step 4: Setting permissions..."
chmod +x "$OLLAMA_PATH"
chown -R ollama:ollama /usr/share/ollama 2>/dev/null || mkdir -p /usr/share/ollama && chown -R ollama:ollama /usr/share/ollama
echo "✅ Permissions set"

# Step 5: Create correct systemd service file
echo ""
echo "⚙️  Step 5: Creating systemd service..."

# Backup existing
if [ -f /etc/systemd/system/ollama.service ]; then
    cp /etc/systemd/system/ollama.service /etc/systemd/system/ollama.service.backup.$(date +%Y%m%d-%H%M%S)
fi

cat > /etc/systemd/system/ollama.service << EOF
[Unit]
Description=Ollama Service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=ollama
Group=ollama
ExecStart=$OLLAMA_PATH serve
Restart=always
RestartSec=10
StartLimitInterval=0
StartLimitBurst=5

Environment="OLLAMA_NUM_PARALLEL=1"
Environment="OLLAMA_MAX_LOADED_MODELS=1"
Environment="OLLAMA_KEEP_ALIVE=10m"
Environment="OLLAMA_HOST=0.0.0.0:11434"

Nice=-10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=ollama

[Install]
WantedBy=multi-user.target
EOF

echo "✅ Service file created with ExecStart=$OLLAMA_PATH serve"

# Step 6: Reload and start
echo ""
echo "🚀 Step 6: Starting service..."
systemctl daemon-reload
systemctl enable ollama
systemctl restart ollama

sleep 3

# Step 7: Verify
echo ""
echo "🧪 Step 7: Verifying..."
if systemctl is-active --quiet ollama; then
    echo "✅ Ollama service is RUNNING"
else
    echo "❌ Service failed. Checking logs..."
    journalctl -u ollama -n 20 --no-pager
    exit 1
fi

# Test API
sleep 2
if curl -sf http://localhost:11434/api/version > /dev/null; then
    VERSION=$(curl -s http://localhost:11434/api/version | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
    echo "✅ Ollama API responding (version: $VERSION)"
else
    echo "⚠️  API not responding yet, waiting..."
    sleep 5
    if curl -sf http://localhost:11434/api/version > /dev/null; then
        echo "✅ Ollama API now responding"
    else
        echo "❌ API still not responding"
        journalctl -u ollama -n 30 --no-pager
        exit 1
    fi
fi

# Test through Nginx
echo ""
if curl -sf https://ai.avs.ma/api/version > /dev/null; then
    echo "✅ Nginx proxy working"
else
    echo "⚠️  Nginx proxy test failed (may need time to propagate)"
fi

# Final status
echo ""
echo "================================================"
echo "✅ FIX COMPLETE!"
echo "================================================"
echo ""
systemctl status ollama --no-pager
echo ""
echo "📋 Useful Commands:"
echo "  • Status: systemctl status ollama"
echo "  • Logs: journalctl -u ollama -f"
echo "  • Test: curl http://localhost:11434/api/version"
echo "  • HTTPS: curl https://ai.avs.ma/api/version"
echo ""
