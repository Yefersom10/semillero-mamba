# Imagen única que ejecuta backend (NestJS, :8000) y frontend (Next.js, :3001)

# --- Build backend ---
FROM node:20-alpine AS back-build
WORKDIR /app
COPY back_nest/package*.json ./
RUN npm ci --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-timeout=120000
COPY back_nest/ .
RUN npm run build

# --- Dependencias de producción del backend ---
FROM node:20-alpine AS back-deps
WORKDIR /app
COPY back_nest/package*.json ./
RUN npm ci --omit=dev --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-timeout=120000

# --- Build frontend ---
FROM node:20-alpine AS front-build
WORKDIR /app
COPY semillero-frontend/package*.json ./
RUN npm ci --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-timeout=120000
COPY semillero-frontend/ .
# NEXT_PUBLIC_* se incrustan en tiempo de build: son URLs vistas desde el navegador
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ARG NEXT_PUBLIC_CHAT_URL=http://localhost:8001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_CHAT_URL=$NEXT_PUBLIC_CHAT_URL
RUN npm run build
RUN npm prune --omit=dev

# --- Producción ---
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=back-deps /app/node_modules ./back/node_modules
COPY --from=back-build /app/package.json ./back/package.json
COPY --from=back-build /app/dist ./back/dist

COPY --from=front-build /app ./front

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8000 3001
CMD ["docker-entrypoint.sh"]
