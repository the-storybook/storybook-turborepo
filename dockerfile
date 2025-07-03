FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV="production"
ENV SHELL="/bin/bash"

WORKDIR /app

RUN npm i -g pnpm@latest
RUN pnpm setup
RUN pnpm install -g turbo
RUN pnpm install dotenv-cli --ignore-workspace-root-check

# COPY --from=builder /app/out/full/ .
# COPY turbo.json turbo.json

# RUN npm i -g pnpm@latest
# RUN pnpm setup
# RUN pnpm install -g turbo
COPY . .
RUN pnpm install
RUN pnpm turbo build --filter=api

# FROM base AS runner
# WORKDIR /app

# # RUN addgroup --system --gid 1001 nodejs
# # RUN adduser --system --uid 1001 nextjs
# # USER nextjs

# COPY --from=installer /app/ .

CMD ["turbo", "run", "start", "--filter=api"]