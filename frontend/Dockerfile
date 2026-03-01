FROM node:24-alpine AS build

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

RUN npm ci

# Copy source code
COPY . .

# NEXT_PUBLIC_ vars are inlined at build time and sent to the browser.
# The browser needs to reach the API via localhost, not Docker-internal hostname.
ARG NEXT_PUBLIC_API_URL=http://localhost:8080
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

# --- Runtime stage ---
FROM node:24-alpine

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only what's needed to run
COPY --from=build /app/package.json ./
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

CMD ["node", "server.js"]
