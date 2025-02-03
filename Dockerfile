# syntax=docker/dockerfile:1

FROM oven/bun:slim AS base

FROM base AS install
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

FROM base AS prerelease
WORKDIR /app

COPY --from=install /app/node_modules ./node_modules
COPY . .

# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030
ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

RUN bun run build

FROM base AS release
WORKDIR /app

RUN addgroup --system --gid 1001 oven
RUN adduser --system --uid 1001 next

COPY public ./public
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=prerelease --chown=next:oven /app/.next/standalone ./
COPY --from=prerelease --chown=next:oven /app/.next/static ./.next/static

USER next

EXPOSE 3000/tcp

CMD [ "bun", "run", "server.js" ]
