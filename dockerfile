#ARG APP_NAME=api
#ARG GIT_SHA="unknown"

# ---- Base ----
# The base image sets up pnpm and turbo, and copies the minimum required
# files to install dependencies. This layer is cached heavily.
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV="production"
ENV SHELL="/bin/bash"

RUN npm i -g pnpm@latest turbo

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY turbo.json ./
COPY tsconfig.json ./
COPY .npmrc ./

# ---- Pruner ----
# The pruner stage uses `turbo prune` to create a minimal version of the
# monorepo with only the files needed for the target application.
FROM base AS pruner
ARG APP_NAME

# Copy package.json for all workspaces
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/api/package.json ./packages/api/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/jest-config/package.json ./packages/jest-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY packages/ui/package.json ./packages/ui/package.json

# Generate a pruned monorepo
RUN turbo prune --scope=${APP_NAME} --docker

# ---- Builder ----
# The builder stage installs dependencies and builds the target application.
FROM base AS builder
ARG APP_NAME
ARG GIT_SHA

WORKDIR /app

# Copy the pruned file structure from the pruner stage
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Install dependencies for the pruned monorepo
RUN pnpm install --frozen-lockfile

# Copy the full source code for the pruned workspaces
COPY --from=pruner /app/out/full .

# Build the target application
RUN pnpm turbo build --filter=${APP_NAME}

# ---- Runner ----
# The runner stage creates the final, small production image.
FROM node:20-slim AS runner
ARG APP_NAME

WORKDIR /app

# Set up a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy the built application and its dependencies from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/ .

# Set the command to start the application
CMD ["pnpm", "start", "--filter=${APP_NAME}"]
