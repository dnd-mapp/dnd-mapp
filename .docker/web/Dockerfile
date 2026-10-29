# Build this image with the web target of .docker/bake.hcl, which the web:image task runs. The build stage builds the app
# from source, and the final stage serves its output with nginx.

# The bundle is the same on every platform, so build it once on the platform of the builder rather than under emulation.
# pnpm refuses to run on any Node.js version other than devEngines.runtime in package.json, so keep this tag on it. The
# full image, unlike the slim one, holds the wget and openssl that the pnpm install script needs.
FROM --platform=$BUILDPLATFORM node:24.22.2-trixie@sha256:8c761eca2bf7eec965f946cf47b8090143cb41f45f2f8699af0cc0298d2d2d19 AS build

# Fail a RUN on an error anywhere in a pipeline, such as a failed download piped into a shell.
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

WORKDIR /repo

# Install the pnpm version of devEngines.packageManager in package.json with the install script, as
# https://pnpm.io/installation describes for Docker. The script installs pnpm to PNPM_HOME/bin, which RUN finds on PATH.
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME/bin:$PATH"

COPY package.json ./

RUN wget -qO- https://get.pnpm.io \
    | env PNPM_VERSION="$(node --print 'require("./package.json").devEngines.packageManager.version')" \
        ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -

# pnpm fetch reads only the lockfile and fills the virtual store in node_modules, so this layer stays cached until the
# dependencies change, whatever else changes. The store in the cache mount spares the downloads when they do. It sits
# outside PNPM_HOME, so the mount leaves the files of pnpm itself alone. The image has no Git repository for the hooks
# that lefthook installs, and no other package may run its install scripts, so skip them.
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store \
    pnpm fetch --ignore-scripts --store-dir /pnpm-store

# Install the web app and the root, which holds moon. The virtual store lacks some packages, such as ng-packagr, and a
# builder that restores the layer above from a remote cache starts with an empty mount, so --prefer-offline downloads
# what neither holds.
COPY . .

RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store \
    pnpm install --frozen-lockfile --prefer-offline --ignore-scripts --store-dir /pnpm-store \
        --filter "@dnd-mapp/web..." --filter dnd-mapp

# The base path that the app is served under, such as /pr-42/. It starts and ends with a slash. --no-actions skips the
# install and sync actions of moon, since the step above installed what the build needs.
ARG BASE_HREF=/

RUN pnpm moon run web:build --no-actions -- --base-href "$BASE_HREF"

# Stamp build-info.json with the commit and version of the build. Both change with every commit, so they come after the
# build to keep its layer cached. The script runs without moon, since the web:build-info task reads the commit from Git.
ARG COMMIT_SHA
ARG VERSION

RUN node apps/web/scripts/build-info.ts

FROM nginx:1.30.6-alpine-slim@sha256:dede8895648b461178c3bc604f7eed4423efe5220b2c4d839f5eb3d34ac3f8f7

# Patch the main configuration of the base image to run without root. The user directive applies to root only, and only
# root can write the PID file to /run. A conf.d file cannot change either, since both sit outside the http block. grep
# fails the build when the PID line no longer matches, for example after the base image changes it.
RUN sed -i -e '/^user /d' -e 's|^pid .*|pid /tmp/nginx.pid;|' /etc/nginx/nginx.conf \
    && grep -qx 'pid /tmp/nginx.pid;' /etc/nginx/nginx.conf \
    && rm /usr/share/nginx/html/*

# Serve the app under its base path. grep fails the build when a placeholder is left in the configuration.
ARG BASE_HREF=/

COPY .docker/web/nginx.conf /etc/nginx/conf.d/default.conf

RUN sed -i "s|@BASE_HREF@|${BASE_HREF}|g" /etc/nginx/conf.d/default.conf \
    && ! grep -q '@BASE_HREF@' /etc/nginx/conf.d/default.conf

COPY --from=build /repo/apps/web/dist/web/browser/ /usr/share/nginx/html${BASE_HREF}

# Run as the nginx user of the base image. A numeric ID lets Kubernetes verify runAsNonRoot. nginx writes to /tmp only,
# and every other file is readable by all, so the image also runs under any other UID.
USER 101:101

# Fail the build on an invalid configuration, checked as the user that runs it.
RUN nginx -t

EXPOSE 4200

# Start nginx directly, since the entrypoint scripts of the base image rewrite files under /etc/nginx, which only root can
# write.
ENTRYPOINT ["nginx", "-g", "daemon off;"]
