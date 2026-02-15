#
# Dockerfile for development tooling & CI tasks.
#
# WHAT IS CONTAINERIZED:
# This container provides a reproducible Node.js environment for:
# - Running linters, formatters, type checks
# - Running unit tests
# - Building with EAS CLI (non-native builds)
#
# It does NOT build native iOS/Android binaries — those are built by
# EAS Build (cloud) or locally with Xcode/Android Studio.
# For Fastlane, use a dedicated macOS runner or EAS Submit.
#
# USAGE:
#   docker compose run --rm app npm run lint
#   docker compose run --rm app npm test
#   docker compose run --rm app npm run typecheck
#

FROM node:20-slim AS base

WORKDIR /app

# Install system deps for native modules compilation (if any)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first for layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --ignore-scripts

# Copy source
COPY . .

# Default command: run tests
CMD ["npm", "test"]
