# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

COPY --from=builder /app/prisma ./prisma
RUN npm ci --only=production
RUN npx prisma generate

USER node

EXPOSE 3000

CMD ["node", "dist/main"]
