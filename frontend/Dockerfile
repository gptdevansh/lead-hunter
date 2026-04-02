# ─────────────────────────────────────────────
# Stage 1 — Dependencies
# ─────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Install dependencies with clean cache
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile


# ─────────────────────────────────────────────
# Stage 2 — Builder: compile Next.js app
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env (public vars only — baked into the JS bundle)
# Override at build with: --build-arg NEXT_PUBLIC_API_BASE_URL=...
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build


# ─────────────────────────────────────────────
# Stage 3 — Runtime: lean production image
# ─────────────────────────────────────────────
FROM node:20-alpine AS runtime

LABEL maintainer="ContentKing Team"
LABEL description="ContentKing Next.js Frontend"

# Security: non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy only what Next.js needs at runtime (standalone output)
COPY --from=builder /app/public ./public

# Leverage Next.js standalone output for minimal bundle
# NOTE: requires `output: 'standalone'` in next.config.ts (handled in compose)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
