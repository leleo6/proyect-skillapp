# Multi-stage Dockerfile for actinvent modular monolith
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root and package definitions
COPY package.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install dependencies
RUN npm install

# Copy source code
COPY client/ ./client/
COPY server/ ./server/

# Build client and server
RUN npm run build

# Runtime Stage
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy root and server package files for production run
COPY package.json ./
COPY server/package.json ./server/

RUN npm install --omit=dev --workspace=server

# Copy built assets
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/src/docs ./server/dist/docs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["npm", "run", "start"]
