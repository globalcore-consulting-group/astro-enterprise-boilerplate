FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/astro.config.mjs ./astro.config.mjs
COPY --from=builder /app/dist ./dist

RUN addgroup -S app \
  && adduser -S -G app -h /home/app app \
  && mkdir -p /home/app \
  && chown -R app:app /app /home/app
ENV HOME=/home/app
USER app

EXPOSE 3001
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3001"]
