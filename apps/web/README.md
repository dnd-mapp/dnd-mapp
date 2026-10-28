# Web

The web client of D&D Mapp: an [Angular](https://angular.dev) app that renders in the browser only. [`angular.json`](angular.json) configures the Angular CLI, and [`moon.yml`](moon.yml) defines the tasks below.

## Tasks

Run each task from the repository root.

| Task      | Command                                          | Runs in CI | Cached |
|:----------|:-------------------------------------------------|:----------:|:------:|
| `start`   | `ng serve`                                       |     no     |   no   |
| `build`   | `ng build`                                       |    yes     |  yes   |
| `image`   | `docker buildx bake --file .docker/bake.hcl web` |     no     |   no   |
| `test`    | `ng test`                                        |     no     |   no   |
| `test-ci` | `ng test -c ci`                                  |    yes     |  yes   |
| `lint`    | `eslint . --max-warnings 0`                      |    yes     |  yes   |

Serve the app at <https://localhost.www.dndmapp.dev:4200>, and rebuild it when a file changes. The dev server needs the [one-time HTTPS setup](../../README.md#development) first:

```bash
pnpm moon run web:start
```

Build the app for production into `dist/web/`:

```bash
pnpm moon run web:build
```

Build the app and package it in a Docker image that serves it with [nginx](https://nginx.org), which needs a running Docker daemon:

```bash
pnpm moon run web:image
```

The task builds the `web` target of [`.docker/bake.hcl`](../../.docker/bake.hcl) with [Docker Bake](https://docs.docker.com/build/bake/), which runs [`.docker/web/Dockerfile`](../../.docker/web/Dockerfile) on the output of `web:build` for the platform of your machine. It tags the image `dndmapp/web:local`; set `TAGS` to a comma-separated list of other tags, of which the first becomes the version label. The target labels the image with the [OCI annotations](https://github.com/opencontainers/image-spec/blob/main/annotations.md) for its title, description, license, and source. [`.docker/web/nginx.conf`](../../.docker/web/nginx.conf) serves the app on port 4200 and answers every path without a file extension with `index.html`, so the router handles it. Run a container of the image at <http://localhost:4200>:

```bash
docker run --rm -p 4200:4200 dndmapp/web:local
```

The image builds on the official `nginx` image but runs nginx as the unprivileged `nginx` user (UID 101) and starts it without the entrypoint scripts of the base image. It needs no added capabilities, writes to `/tmp` only, and runs under any other UID too. Harden a container by dropping every capability and making the root file system read-only, with a tmpfs at `/tmp`:

```bash
docker run --rm -p 4200:4200 --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges dndmapp/web:local
```

The CI job leaves `web:image` out of its checks. Separate jobs build the `web-gha` target with [`docker/bake-action`](https://github.com/docker/bake-action) instead, whenever moon finds that a change affects the task. That target builds the image for `linux/amd64` and `linux/arm64`, attaches an SBOM and a provenance attestation to each, caches its layers in the GitHub Actions cache, and takes its tags and its version, revision, and creation labels from [`docker/metadata-action`](https://github.com/docker/metadata-action). CI pushes it to [Docker Hub](https://hub.docker.com/r/dndmapp/web):

| Event                 | Tags                   |
|:----------------------|:-----------------------|
| Pull request          | `pr-<number>`          |
| Push to `main`        | `sha-<short>`, `edge`  |
| Pull request closed   | deletes `pr-<number>`  |

The `<version>` and `latest` tags wait for the release pipeline.

Run the unit tests with [Vitest](https://vitest.dev) in headless Chromium, rerun them when a file changes, and open the Vitest UI:

```bash
pnpm moon run web:test
```

Run the unit tests once, as CI does. On GitHub Actions, the `github-actions` reporter annotates the pull request with each failing test:

```bash
pnpm moon run web:test-ci
```

Both test tasks collect coverage into `coverage/web/` and fail when statements, branches, functions, or lines drop below 80%.

Lint the TypeScript and the templates with [ESLint](https://eslint.org), [`typescript-eslint`](https://typescript-eslint.io), and [`angular-eslint`](https://github.com/angular-eslint/angular-eslint). The task fails on any finding, warnings included, and [`eslint.config.ts`](eslint.config.ts) holds the rules:

```bash
pnpm moon run web:lint
```

The tests run in Chromium through [Playwright](https://playwright.dev), which the [Development](../../README.md#development) section of the root README installs.
