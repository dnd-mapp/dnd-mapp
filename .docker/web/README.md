# D&D Mapp web

The web client of [D&D Mapp](https://github.com/dnd-mapp/dnd-mapp). The app renders in the browser only, so the image serves its static files with [nginx](https://nginx.org) and needs no other service. Each tag holds an image for `linux/amd64` and `linux/arm64`.

## Tags

| Tag               | Image                                                                                 |
|:------------------|:--------------------------------------------------------------------------------------|
| `latest`          | The newest release, or an earlier one while a broken release is rolled back.          |
| `<version>`       | A release, such as `0.1.0`.                                                           |
| `<major>.<minor>` | The newest release of a minor version, such as `0.1`.                                 |
| `<major>`         | The newest release of a major version, such as `1`. Releases add it from `1.0.0` on.  |
| `edge`            | The latest commit of `main` that changed the image. It may break at any time.         |
| `sha-<short>`     | A commit of `main` that changed the image, such as `sha-41b5eb9`.                     |
| `pr-<number>`     | A pull request, for review only. The tag is deleted once the pull request closes.     |

Run `latest` or a version tag for a release. The [GitHub Releases](https://github.com/dnd-mapp/dnd-mapp/releases) list what each version changes.

## Running

Run the newest release, and open the app at <http://localhost:4200>:

```bash
docker run --rm -p 4200:4200 dndmapp/web
```

The container serves the app on port 4200, under the path `/`. It runs nginx as the unprivileged `nginx` user (UID 101), needs no added capabilities, writes to `/tmp` only, and runs under any other UID too. Harden it by dropping every capability and making the root file system read-only, with a tmpfs at `/tmp`:

```bash
docker run --rm -p 4200:4200 --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges dndmapp/web
```

To run it with Docker Compose, hardened the same way, save this as `compose.yaml` and run `docker compose up -d`:

```yaml
services:
    web:
        image: dndmapp/web
        ports:
            - "4200:4200"
        read_only: true
        tmpfs:
            - /tmp
        cap_drop:
            - ALL
        security_opt:
            - no-new-privileges:true
        restart: unless-stopped
```

## Health check

The container answers `/healthz` with an empty `200`, and leaves the request out of its access log. The `HEALTHCHECK` of the image probes that path, so `docker ps` shows whether the container is `healthy`. Kubernetes ignores `HEALTHCHECK`, so point the probes of a deployment at `/healthz` on port 4200.

## Build info

`/build-info.json` reports the commit and version that the image was built from, so a deploy can check which build it runs. The version is the release for a version tag, or the tag that the image was built for otherwise, such as `edge` or `pr-42`:

```json
{ "commit": "41b5eb94707ddc4503d76c190d1cc980973f7218", "version": "0.1.0" }
```

nginx serves the file with `Cache-Control: no-store`, so neither browsers nor proxies keep an outdated copy.

## Source

The image is built from [`.docker/web/Dockerfile`](https://github.com/dnd-mapp/dnd-mapp/blob/main/.docker/web/Dockerfile), and [`.docker/web/nginx.conf`](https://github.com/dnd-mapp/dnd-mapp/blob/main/.docker/web/nginx.conf) configures nginx. The [README of the web app](https://github.com/dnd-mapp/dnd-mapp/blob/main/apps/web/README.md) explains how to build the image yourself, for example under another base path. Report problems in the [issues](https://github.com/dnd-mapp/dnd-mapp/issues) of the repository. The image is licensed under the [MIT License](https://github.com/dnd-mapp/dnd-mapp/blob/main/LICENSE).
