# --- Stage 1: Build Next.js Frontend with Bun ---
FROM oven/bun:1-alpine AS frontend-builder
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install

COPY . .
ENV NODE_OPTIONS="--max-old-space-size=1536"
RUN bun run build

# --- Stage 2: Combined Production Runtime ---
FROM python:3.10-slim

# Install system dependencies, Node.js runtime, Nginx, and gettext-base (for envsubst)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    nginx \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    gettext-base \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python backend dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt
COPY backend/ ./backend/

# Copy compiled Next.js app from Stage 1
COPY --from=frontend-builder /app ./

# Copy Nginx configuration and enable via symlink
COPY nginx.conf /etc/nginx/sites-available/default
RUN rm -f /etc/nginx/sites-enabled/default && \
    ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Copy and setup entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 10000

CMD ["/app/entrypoint.sh"]