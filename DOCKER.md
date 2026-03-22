# Docker Deployment Guide

This guide covers deploying the NewDawn Zomboid landing page using Docker and Caddy.

## Prerequisites

- Docker and Docker Compose installed
- Caddy installed (for reverse proxy)
- `.env` file configured (see `.env.example`)

## Quick Start

1. **Copy and configure environment file:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Build and start the container:**
   ```bash
   docker-compose up -d
   ```

3. **Check logs:**
   ```bash
   docker-compose logs -f
   ```

## Architecture

- **Frontend**: Built static files in `/app/dist` (exposed via volume to `./dist`)
- **Backend API**: Node.js server on port 3001
- **Database**: SQLite in `./data` directory (persisted via volume)

## Caddy Configuration

Example Caddyfile to serve both frontend and API:

```caddy
zomboid.yourdomain.com {
    # Serve static frontend files
    root * /path/to/project/dist
    file_server

    # Reverse proxy API requests to backend
    handle /api/* {
        reverse_proxy localhost:3001
    }

    # Fallback to index.html for SPA routing
    try_files {path} /index.html
}
```

## Volumes

- `./data` - SQLite database persistence
- `./dist` - Built frontend files (read-only, exposed for Caddy)

## Environment Variables

See `.env.example` for all available configuration options:

- `ADMIN_PASSWORD` - Admin panel password
- `RCON_HOST`, `RCON_PORT`, `RCON_PASSWORD` - Project Zomboid server RCON
- `SERVER_IP`, `SERVER_PORT` - Display information

## Production Deployment

1. **Pull the latest image from GitHub Container Registry:**
   ```bash
   docker pull ghcr.io/YOUR_USERNAME/zomboid-landing:latest
   ```

2. **Update docker-compose.yml to use the image:**
   ```yaml
   services:
     app:
       image: ghcr.io/YOUR_USERNAME/zomboid-landing:latest
       # ... rest of config
   ```

3. **Deploy:**
   ```bash
   docker-compose up -d
   ```

## Updating

```bash
docker-compose pull
docker-compose up -d
```

## Troubleshooting

**Check container status:**
```bash
docker-compose ps
```

**View logs:**
```bash
docker-compose logs -f app
```

**Restart container:**
```bash
docker-compose restart app
```

**Access container shell:**
```bash
docker-compose exec app sh
```

**Verify health:**
```bash
curl http://localhost:3001/api/health
```
