# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma.config.js ./

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
RUN npm ci --only=production --ignore-scripts
RUN npm install -g prisma@7.4.0
RUN npx prisma generate
RUN chmod +x ./scripts/docker-start.sh

USER node

EXPOSE 3000

CMD ["sh", "./scripts/docker-start.sh"]
