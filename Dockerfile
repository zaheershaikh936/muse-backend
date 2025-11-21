# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies with cache mount
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:22-alpine

# Install dumb-init
RUN apk add --no-cache dumb-init

WORKDIR /app

# Create non-root user EARLY (before copying files)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files with correct ownership from the start
COPY --chown=nodejs:nodejs package.json yarn.lock ./

# Install production dependencies with cache mount
RUN --mount=type=cache,target=/root/.yarn,uid=1001,gid=1001 \
    yarn install --production --frozen-lockfile --ignore-scripts && \
    yarn cache clean

# Copy built application with correct ownership
COPY --chown=nodejs:nodejs --from=builder /app/dist ./dist

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 8080

# Use dumb-init and start application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]