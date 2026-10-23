# node:24-alpine, pinned by digest. Dependabot bumps it; keep the version in sync with .nvmrc.
ARG NODE_IMAGE=node:24-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53

FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

FROM ${NODE_IMAGE} AS build
WORKDIR /app
# NEXT_PUBLIC_* values are inlined at build time. Indexing is never enabled in the image.
ARG NEXT_PUBLIC_SITE_URL=""
ARG COMMIT_SHA=""
ENV BUILD_STANDALONE=1 \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    COMMIT_SHA=${COMMIT_SHA}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM ${NODE_IMAGE} AS runtime
ARG COMMIT_SHA=""
LABEL org.opencontainers.image.title="portfolio" \
      org.opencontainers.image.description="Adriano Matoba Lipski's portfolio (Next.js standalone server)" \
      org.opencontainers.image.source="https://github.com/dr1co/portfolio" \
      org.opencontainers.image.revision="${COMMIT_SHA}"
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --start-interval=2s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/').then(r => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]
CMD ["node", "server.js"]
