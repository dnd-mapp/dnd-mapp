# Build this image with the web target of .docker/bake.hcl. The image serves the output of web:build, so build the app
# first. The web:image task runs both.
FROM nginx:1.30.6-alpine-slim@sha256:dede8895648b461178c3bc604f7eed4423efe5220b2c4d839f5eb3d34ac3f8f7

# Patch the main configuration of the base image to run without root. The user directive applies to root only, and only
# root can write the PID file to /run. A conf.d file cannot change either, since both sit outside the http block. grep
# fails the build when the PID line no longer matches, for example after the base image changes it.
RUN sed -i -e '/^user /d' -e 's|^pid .*|pid /tmp/nginx.pid;|' /etc/nginx/nginx.conf \
    && grep -qx 'pid /tmp/nginx.pid;' /etc/nginx/nginx.conf \
    && rm /usr/share/nginx/html/*

COPY .docker/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY apps/web/dist/web/browser/ /usr/share/nginx/html/

# Run as the nginx user of the base image. A numeric ID lets Kubernetes verify runAsNonRoot. nginx writes to /tmp only,
# and every other file is readable by all, so the image also runs under any other UID.
USER 101:101

# Fail the build on an invalid configuration, checked as the user that runs it.
RUN nginx -t

EXPOSE 4200

# Start nginx directly, since the entrypoint scripts of the base image rewrite files under /etc/nginx, which only root can
# write.
ENTRYPOINT ["nginx", "-g", "daemon off;"]
