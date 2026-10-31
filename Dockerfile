FROM node:22-alpine AS base

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npx prisma generate


FROM base AS builder

RUN npm run build


FROM base AS migrator

CMD ["npx", "prisma", "migrate", "deploy"]


FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apk add --no-cache wget

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder \
    --chown=nextjs:nodejs \
    /app/.next/standalone ./

COPY --from=builder \
    --chown=nextjs:nodejs \
    /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]