FROM --platform=$BUILDPLATFORM node:25.8 AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-*.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .

RUN pnpm build


FROM nginx:1.29-alpine3.23

COPY --from=builder /app/dist/dnd-mapp/browser /usr/share/nginx/html

COPY .docker/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200
