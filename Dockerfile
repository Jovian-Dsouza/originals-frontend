# Multi-stage build for React + TypeScript + Vite frontend
FROM node:24-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat python3 make g++ py3-pip
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Rebuild the source code only when needed
FROM base AS builder
RUN apk add --no-cache libc6-compat python3 make g++ py3-pip
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .

# Build arguments for environment variables
ARG VITE_API_BASE_URL
ARG VITE_WS_URL
ARG VITE_PINATA_API_KEY
ARG VITE_PINATA_SECRET_KEY
ARG VITE_PRIVY_APP_ID
ARG VITE_PRIVY_APP_SECRET
ARG VITE_PRIVY_ZORA_APP_ID

# Set environment variables for build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_PINATA_API_KEY=$VITE_PINATA_API_KEY
ENV VITE_PINATA_SECRET_KEY=$VITE_PINATA_SECRET_KEY
ENV VITE_PRIVY_APP_ID=$VITE_PRIVY_APP_ID
ENV VITE_PRIVY_APP_SECRET=$VITE_PRIVY_APP_SECRET
ENV VITE_PRIVY_ZORA_APP_ID=$VITE_PRIVY_ZORA_APP_ID

# Build the application
RUN npm run build

# Production image, copy all the files and run the app
FROM node:24-alpine AS runner
WORKDIR /app

# Install serve to serve static files
RUN npm install -g serve

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Expose port 3008
EXPOSE 3008

# Start the application
CMD ["serve", "-s", "dist", "-l", "3008"]
