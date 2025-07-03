FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV="production"
ENV SHELL="/bin/bash"
FROM base AS builder
WORKDIR /app

RUN npm i -g pnpm@latest
RUN pnpm setup
RUN pnpm install -g turbo

COPY . .
RUN turbo prune api --docker
# Copy root package.json and lockfile
COPY package.json ./
COPY pnpm-lock.yaml ./


FROM base AS installer
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN npm i -g pnpm@latest
RUN pnpm setup
RUN pnpm install


COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN npm i -g pnpm@latest
RUN pnpm setup
RUN pnpm install -g turbo
RUN pnpm turbo build --filter=api

# FROM base AS runner
# WORKDIR /app

# # RUN addgroup --system --gid 1001 nodejs
# # RUN adduser --system --uid 1001 nextjs
# # USER nextjs

# COPY --from=installer /app/ .

CMD ["turbo", "run", "start", "--filter=api"]