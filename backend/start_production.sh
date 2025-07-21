#!/bin/bash
# Production startup script for Thread Extractor Backend

set -e  # Exit on any error

# Configuration
APP_DIR="/Users/linhuizi/Desktop/threadextractor/backend"
LOG_DIR="/var/log/gunicorn"
PID_FILE="/var/run/gunicorn/thread_extractor.pid"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Thread Extractor Backend in Production Mode${NC}"

# Check if running as root (for production)
if [[ $EUID -eq 0 ]]; then
   echo -e "${YELLOW}Warning: Running as root. Consider using a dedicated user.${NC}"
fi

# Create log directory if it doesn't exist
if [ ! -d "$LOG_DIR" ]; then
    echo "Creating log directory: $LOG_DIR"
    sudo mkdir -p "$LOG_DIR"
    sudo chown -R $USER:$USER "$LOG_DIR"
fi

# Create PID directory if it doesn't exist
PID_DIR=$(dirname "$PID_FILE")
if [ ! -d "$PID_DIR" ]; then
    echo "Creating PID directory: $PID_DIR"
    sudo mkdir -p "$PID_DIR"
    sudo chown -R $USER:$USER "$PID_DIR"
fi

# Change to app directory
cd "$APP_DIR"

# Check if virtual environment exists (optional)
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Set production environment variables
export FLASK_DEBUG=False
export FLASK_HOST=127.0.0.1
export FLASK_PORT=8080
export GUNICORN_WORKERS=4
export GUNICORN_ACCESS_LOG="$LOG_DIR/access.log"
export GUNICORN_ERROR_LOG="$LOG_DIR/error.log"
export GUNICORN_LOG_LEVEL=info

echo -e "${GREEN}Environment Configuration:${NC}"
echo "  FLASK_DEBUG: $FLASK_DEBUG"
echo "  FLASK_HOST: $FLASK_HOST"
echo "  FLASK_PORT: $FLASK_PORT"
echo "  WORKERS: $GUNICORN_WORKERS"
echo "  ACCESS LOG: $GUNICORN_ACCESS_LOG"
echo "  ERROR LOG: $GUNICORN_ERROR_LOG"

# Check if port is already in use
if lsof -Pi :$FLASK_PORT -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}Error: Port $FLASK_PORT is already in use${NC}"
    echo "Please stop the existing service or change the port"
    exit 1
fi

# Start Gunicorn
echo -e "${GREEN}Starting Gunicorn server...${NC}"
exec gunicorn \
    --config gunicorn_config.py \
    --pid "$PID_FILE" \
    --daemon \
    app:app

echo -e "${GREEN}Thread Extractor Backend started successfully!${NC}"
echo "  PID file: $PID_FILE"
echo "  Access log: $GUNICORN_ACCESS_LOG"
echo "  Error log: $GUNICORN_ERROR_LOG"
echo ""
echo "To stop the server: kill -TERM \$(cat $PID_FILE)"
echo "To reload the server: kill -HUP \$(cat $PID_FILE)"