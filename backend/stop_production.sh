#!/bin/bash
# Stop script for Thread Extractor Backend

# Configuration
PID_FILE="/var/run/gunicorn/thread_extractor.pid"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Stopping Thread Extractor Backend${NC}"

# Check if PID file exists
if [ ! -f "$PID_FILE" ]; then
    echo -e "${YELLOW}Warning: PID file not found at $PID_FILE${NC}"
    echo "The server may not be running or was started differently."
    
    # Try to find the process anyway
    PIDS=$(pgrep -f "gunicorn.*app:app" || true)
    if [ -n "$PIDS" ]; then
        echo -e "${YELLOW}Found running Gunicorn processes: $PIDS${NC}"
        echo "Attempting to stop them..."
        kill -TERM $PIDS
        sleep 2
        
        # Check if processes are still running
        REMAINING=$(pgrep -f "gunicorn.*app:app" || true)
        if [ -n "$REMAINING" ]; then
            echo -e "${RED}Processes still running. Force killing...${NC}"
            kill -KILL $REMAINING
        fi
        echo -e "${GREEN}Processes stopped.${NC}"
    else
        echo -e "${YELLOW}No Gunicorn processes found.${NC}"
    fi
    exit 0
fi

# Read PID from file
PID=$(cat "$PID_FILE")

# Check if process is running
if ! kill -0 "$PID" 2>/dev/null; then
    echo -e "${YELLOW}Process $PID is not running. Cleaning up PID file.${NC}"
    rm -f "$PID_FILE"
    exit 0
fi

echo "Stopping process $PID..."

# Send TERM signal for graceful shutdown
kill -TERM "$PID"

# Wait for graceful shutdown
echo "Waiting for graceful shutdown..."
for i in {1..10}; do
    if ! kill -0 "$PID" 2>/dev/null; then
        echo -e "${GREEN}Process stopped gracefully.${NC}"
        rm -f "$PID_FILE"
        exit 0
    fi
    sleep 1
done

# Force kill if still running
echo -e "${YELLOW}Graceful shutdown failed. Force killing...${NC}"
kill -KILL "$PID" 2>/dev/null || true

# Clean up PID file
rm -f "$PID_FILE"

echo -e "${GREEN}Thread Extractor Backend stopped.${NC}"