#!/bin/bash

# Fix Ollama Systemd Service
# Run on VPS as root: sudo bash fix-ollama-systemd.sh [--use-snap]

set -e

USE_SNAP=false
if [[ "$1" == "--use-snap" ]]; then
    USE_SNAP=true
fi

echo "🔧 Fixing Ollama Systemd Service..."
echo "================================================"

# Check root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root: sudo bash fix-ollama-systemd.sh"
    exit 1
fi

# Step 1: Detect and handle Ollama installation
echo ""
echo "📍 Step 1: Detecting Ollama installation..."
CURRENT_OLLAMA=$(command -v ollama || echo "")

if [ -n "$CURRENT_OLLAMA" ] && [[ "$CURRENT_OLLAMA" == *"/snap/"* ]]; then
    echo "⚠️  Snap Ollama detected at: $CURRENT_OLLAMA"
    if [ "$USE_SNAP" = false ]; then
        echo "   Removing Snap version to install native binary..."
        
        # Stop and disable snap service
        systemctl stop snap.ollama.ollama.service 2>/dev/null || true
        systemctl disable snap.ollama.ollama.service 2>/dev/null || true
        
        # Remove snap
        snap remove ollama 2>/dev/null || true
        sleep 2
        
        echo "   Installing native Ollama binary..."
        curl -fsSL https://ollama.com/install.sh | sh
        OLLAMA_PATH="/usr/local/bin/ollama"
    else
        echo "   Using Snap installation (--use-snap flag detected)"
        OLLAMA_PATH="/usr/bin/snap"
        OLLAMA_ARGS="run ollama serve"
    fi
elif [ -n "$CURRENT_OLLAMA" ]; then
    echo "✅ Native Ollama found at: $CURRENT_OLLAMA"
    OLLAMA_PATH="$CURRENT_OLLAMA"
else
    echo "   Ollama not found. Installing native binary..."
    curl -fsSL https://ollama.com/install.sh | sh
    OLLAMA_PATH="/usr/local/bin/ollama"
fi

echo "✅ Will use: $OLLAMA_PATH ${OLLAMA_ARGS:-serve}"

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

# Step 3: Create ollama user and set permissions
echo ""
echo "👤 Step 3: Setting up user and permissions..."

if [ "$USE_SNAP" = false ]; then
    # Native installation: use ollama user
    if ! id -u ollama >/dev/null 2>&1; then
        useradd -r -s /bin/false -d /usr/share/ollama -m ollama
        echo "✅ Created ollama user"
    else
        echo "✅ ollama user already exists"
    fi
    
    # Set permissions
    chmod +x "$OLLAMA_PATH" 2>/dev/null || true
    mkdir -p /usr/share/ollama
    chown -R ollama:ollama /usr/share/ollama
    
    SERVICE_USER="ollama"
    SERVICE_GROUP="ollama"
    echo "✅ Permissions set (user: ollama)"
else
    # Snap installation: use root
    SERVICE_USER="root"
    SERVICE_GROUP="root"
    echo "✅ Using root for Snap service"
fi

# Step 4: Create correct systemd service file
echo ""
echo "⚙️  Step 4: Creating systemd service..."

# Backup existing
if [ -f /etc/systemd/system/ollama.service ]; then
    cp /etc/systemd/system/ollama.service /etc/systemd/system/ollama.service.backup.$(date +%Y%m%d-%H%M%S)
    echo "   Backed up existing service file"
fi

# Determine ExecStart command
if [ "$USE_SNAP" = true ]; then
    EXEC_START="$OLLAMA_PATH $OLLAMA_ARGS"
else
    EXEC_START="$OLLAMA_PATH serve"
fi

cat > /etc/systemd/system/ollama.service << EOF
[Unit]
Description=Ollama Service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=$SERVICE_USER
Group=$SERVICE_GROUP
ExecStart=$EXEC_START
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

echo "✅ Service file created"
echo "   User/Group: $SERVICE_USER/$SERVICE_GROUP"
echo "   ExecStart: $EXEC_START"

# Step 5: Reload and start
echo ""
echo "🚀 Step 5: Starting service..."
systemctl daemon-reload
systemctl enable ollama
systemctl restart ollama

sleep 3

# Step 6: Verify service and API
echo ""
echo "🧪 Step 6: Verifying service..."

# Check systemd status
if systemctl is-active --quiet ollama; then
    echo "✅ Ollama service is RUNNING"
else
    echo "❌ Service failed. Diagnostics:"
    echo ""
    echo "📋 Service Status:"
    systemctl status ollama --no-pager || true
    echo ""
    echo "📋 Recent Logs:"
    journalctl -u ollama -n 30 --no-pager
    echo ""
    echo "📋 Port 11434:"
    lsof -i:11434 || echo "   No process listening on port 11434"
    echo ""
    echo "📋 Service File:"
    cat /etc/systemd/system/ollama.service
    exit 1
fi

# Test local API
echo ""
echo "🧪 Testing API endpoints..."
sleep 2

MAX_RETRIES=3
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -sf http://localhost:11434/api/version > /dev/null 2>&1; then
        VERSION=$(curl -s http://localhost:11434/api/version | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
        echo "✅ Local API responding (version: $VERSION)"
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
            echo "⏳ API not ready, retry $RETRY_COUNT/$MAX_RETRIES..."
            sleep 3
        else
            echo "❌ Local API not responding after $MAX_RETRIES attempts"
            echo ""
            echo "📋 Diagnostics:"
            journalctl -u ollama -n 50 --no-pager
            echo ""
            lsof -i:11434 || echo "No process on port 11434"
            exit 1
        fi
    fi
done

# Test through Nginx/HTTPS
sleep 1
if curl -sf https://ai.avs.ma/api/version > /dev/null 2>&1; then
    HTTPS_VERSION=$(curl -s https://ai.avs.ma/api/version | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
    echo "✅ HTTPS proxy working (version: $HTTPS_VERSION)"
else
    echo "⚠️  HTTPS test failed (may need DNS/Cloudflare propagation)"
    echo "   Local API works, so Nginx config may need review"
fi

# Final status
echo ""
echo "================================================"
echo "✅ FIX COMPLETE!"
echo "================================================"
echo ""
systemctl status ollama --no-pager -l
echo ""
echo "📋 Useful Commands:"
echo "  • Status:   systemctl status ollama"
echo "  • Logs:     journalctl -u ollama -f"
echo "  • Restart:  systemctl restart ollama"
echo "  • Test:     curl http://localhost:11434/api/version"
echo "  • HTTPS:    curl https://ai.avs.ma/api/version"
if [ "$USE_SNAP" = false ]; then
    echo "  • Re-run:   sudo bash fix-ollama-systemd.sh"
else
    echo "  • Re-run:   sudo bash fix-ollama-systemd.sh --use-snap"
fi
echo ""
