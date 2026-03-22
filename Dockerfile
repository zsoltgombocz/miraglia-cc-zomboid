# Multi-stage build for NewDawn Zomboid Landing Page

# Stage 1: Build frontend
FROM oven/bun:1 AS frontend-builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy frontend source
COPY src ./src
COPY index.html ./
COPY vite.config.js ./
COPY postcss.config.js ./
COPY tailwind.config.js ./

# Build frontend
RUN bun run build

# Stage 2: Production
FROM oven/bun:1-slim

WORKDIR /app

# Install production dependencies only
COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

# Copy backend source
COPY server ./server
COPY drizzle.config.js ./

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/dist ./dist

# Create data directory
RUN mkdir -p /app/server/data

# Expose ports
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun -e "fetch('http://localhost:3001/api/health').then(r => r.ok ? process.exit(0) : process.exit(1))" || exit 1

# Start the server
CMD ["bun", "run", "server"]
