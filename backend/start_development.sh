#!/bin/bash
# Development startup script for Thread Extractor Backend

set -e  # Exit on any error

# Configuration
APP_DIR="/Users/linhuizi/Desktop/threadextractor/backend"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Thread Extractor Backend in Development Mode${NC}"

# Change to app directory
cd "$APP_DIR"

# Check if virtual environment exists (optional)
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Set development environment variables
export FLASK_DEBUG=False  # Keep False even in development for security
export FLASK_HOST=127.0.0.1
export FLASK_PORT=${FLASK_PORT:-8080}
export GUNICORN_WORKERS=2  # Fewer workers for development

echo -e "${GREEN}Development Environment Configuration:${NC}"
echo "  FLASK_DEBUG: $FLASK_DEBUG"
echo "  FLASK_HOST: $FLASK_HOST"
echo "  FLASK_PORT: $FLASK_PORT"
echo "  WORKERS: $GUNICORN_WORKERS"

echo -e "${YELLOW}Note: Using Gunicorn even in development for consistency${NC}"

# Start Gunicorn in foreground for development
echo -e "${GREEN}Starting Gunicorn server (development mode)...${NC}"
exec gunicorn \
    --config gunicorn_config.py \
    --reload \
    --access-logfile - \
    --error-logfile - \
    app:app