# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /usr/local/app

# Vite env (build-time) — voice gateway + streaming ASR / ALD
ARG VITE_API_BASE_URL
ARG VITE_API_KEY
ARG VITE_BHASHINI_API_KEY
ARG VITE_STREAMING_ASR_ENABLED=true
ARG VITE_VOICE_GATEWAY_ENABLED=true
ARG VITE_VOICE_GATEWAY_URL
ARG VITE_BHASHINI_SOCKET_URL=
ARG VITE_NOTIFICATION_API_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_API_KEY=$VITE_API_KEY \
    VITE_BHASHINI_API_KEY=$VITE_BHASHINI_API_KEY \
    VITE_STREAMING_ASR_ENABLED=$VITE_STREAMING_ASR_ENABLED \
    VITE_VOICE_GATEWAY_ENABLED=$VITE_VOICE_GATEWAY_ENABLED \
    VITE_VOICE_GATEWAY_URL=$VITE_VOICE_GATEWAY_URL \
    VITE_BHASHINI_SOCKET_URL=$VITE_BHASHINI_SOCKET_URL \
    VITE_NOTIFICATION_API_URL=$VITE_NOTIFICATION_API_URL

COPY package.json ./
RUN rm -f package-lock.json && npm install --legacy-peer-deps --include=optional --force
COPY ./ ./
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /usr/local/app/dist .
# Add nginx config for SPA routing + /voice-gateway/ proxy
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8081
CMD ["nginx", "-g", "daemon off;"]
# docker buildx build --platform linux/amd64 -t asia-south1-docker.pkg.dev/s-0-000236-99/moa-bharatvistaar-repo/oan-ui-dev:latest --push .
