#!/usr/bin/env bash
set -e

echo "=== Starting FastAPI Backend ==="
uvicorn backend.main:app --host 127.0.0.1 --port 5000 --timeout-keep-alive 75 &

echo "=== Starting Next.js Frontend ==="
npm run start -- -p 3000 &

# Give background processes 4 seconds to bind
sleep 4

# Grab Render's assigned port or default to 10000
RENDER_PORT="${PORT:-10000}"
echo "=== Configuring Nginx for Port $RENDER_PORT ==="

sed -i "s/listen.*;/listen $RENDER_PORT;/g" /etc/nginx/sites-enabled/default

echo "=== Launching Nginx ==="
nginx -g "daemon off;"