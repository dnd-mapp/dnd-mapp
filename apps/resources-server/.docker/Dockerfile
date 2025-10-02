FROM node:22 AS builder

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npx nx build resources-server && \
    rm -r node_modules && \
    cd dist/apps/resources-server && \
    npm ci


FROM node:22-alpine3.22

WORKDIR /server

COPY --from=builder /app/dist/apps/resources-server .

COPY --from=builder /app/apps/resources-server/.prisma/client /.prisma/client

COPY --from=builder /app/dist/apps/resources-client /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /server && \
    chown -R nestjs:nodejs /app

USER nestjs

ENV SERVER_HOST="0.0.0.0" \
    CLIENT_STATIC_FILES_PATH="/app/browser"

EXPOSE 4300

CMD ["node", "/server/main.js"]
