# syntax=docker/dockerfile:1
# Production image for Next.js + Payload CMS (requires `output: 'standalone'` in next.config.ts)

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---------- Dependencies ----------
FROM base AS deps
COPY package.json package-lock.json .npmrc ./
RUN --mount=type=cache,target=/root/.npm npm ci

# ---------- Build ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Payload needs these to load its config during `next build`.
# Real values are injected at runtime; placeholders are fine for the build.
ARG DATABASE_URL=mongodb://127.0.0.1/build-placeholder
ARG PAYLOAD_SECRET=build-placeholder-secret
ENV DATABASE_URL=$DATABASE_URL \
    PAYLOAD_SECRET=$PAYLOAD_SECRET

RUN npm run build

# ---------- Runtime ----------
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Writable dir for Payload media uploads (mount a volume here)
RUN mkdir -p /app/public/media && chown -R nextjs:nodejs /app/public/media

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
