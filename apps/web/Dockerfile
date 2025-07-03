# Dockerfile for the web application
FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV="production"
ENV SHELL="/bin/bash"

# Install pnpm and turbo
RUN npm i -g pnpm@latest turbo

WORKDIR /app

# Copy the entire monorepo context
COPY . .

# Install dependencies
RUN pnpm install

# Build the web application
RUN pnpm turbo build --filter=web

# Use a smaller, production-ready image
FROM node:20-slim AS runner

WORKDIR /app

# Set up a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy the built web app from the builder stage
COPY --from=base --chown=nextjs:nodejs /app/apps/web/.next /app/apps/web/.next
COPY --from=base /app/apps/web/package.json /app/apps/web/package.json
COPY --from=base /app/apps/web/public /app/apps/web/public
COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/apps/web/node_modules /app/apps/web/node_modules


# Set the command to start the web application
CMD ["pnpm", "start", "--filter=web"]
