# Web

The web client of D&D Mapp: an [Angular](https://angular.dev) app that renders in the browser only. The app bootstraps the root component and app config of [`@dnd-mapp/core-web`](../../packages/core/web/README.md), and holds only what makes it deployable: `main.ts`, `index.html`, the global styles, and the public assets. [`angular.json`](angular.json) configures the Angular CLI, and [`moon.yml`](moon.yml) defines the tasks below.

## Tasks

Run each task from the repository root.

| Task         | Command                                          | Runs in CI | Cached |
|:-------------|:-------------------------------------------------|:----------:|:------:|
| `start`      | `ng serve`                                       |     no     |   no   |
| `build`      | `ng build`                                       |    yes     |  yes   |
| `build-info` | `node scripts/build-info.ts`                     |     no     |   no   |
| `image`      | `docker buildx bake --file .docker/bake.hcl web` |     no     |   no   |
| `lint`       | `eslint . --max-warnings 0`                      |    yes     |  yes   |

Serve the app at <https://localhost.www.dndmapp.dev:4200>, and rebuild it when a file changes. The dev server needs the [one-time HTTPS setup](../../README.md#development) first:

```bash
pnpm moon run web:start
```

Build the app for production into `dist/web/`:

```bash
pnpm moon run web:build
```

`build-info.json` reports the commit and version of a build, so a deploy can check which build an environment runs. [`public/build-info.json`](public/build-info.json) holds placeholder values, which the dev server serves as they are: the commit `dev`, and the version in [`package.json`](package.json) with a `-dev` suffix. Build the app and stamp the commit of `HEAD` and the version `local` into the copy in `dist/web/`, with [`scripts/build-info.ts`](scripts/build-info.ts):

```bash
pnpm moon run web:build-info
```

Build the app from source and package it in a Docker image that serves it with [nginx](https://nginx.org), which needs a running Docker daemon but no build of the app:

```bash
pnpm moon run web:image
```

The task builds the `web` target of [`.docker/bake.hcl`](../../.docker/bake.hcl) with [Docker Bake](https://docs.docker.com/build/bake/), which runs [`.docker/web/Dockerfile`](../../.docker/web/Dockerfile) for the platform of your machine. The first stage of the Dockerfile runs on the platform of the builder. It installs pnpm with its [install script](https://pnpm.io/installation), installs the dependencies with the pnpm store in a cache mount, builds the app with `moon run web:build`, and stamps `build-info.json` with `scripts/build-info.ts`. The final stage copies the bundle into the nginx image. The task tags the image `dndmapp/web:local`; set `TAGS` to a comma-separated list of other tags, of which the first becomes the version label. The target labels the image with the [OCI annotations](https://github.com/opencontainers/image-spec/blob/main/annotations.md) for its title, description, license, and source.

Bake passes these variables from the environment to the Dockerfile as build arguments:

| Variable     | Purpose                                                        | Default                 |
|:-------------|:---------------------------------------------------------------|:------------------------|
| `BASE_HREF`  | The base path that the app is served under, such as `/pr-42/`. | `/`                     |
| `COMMIT_SHA` | The commit that `build-info.json` reports.                     | The commit of `HEAD`    |
| `VERSION`    | The version that `build-info.json` reports.                    | The first tag in `TAGS` |

[`.docker/web/nginx.conf`](../../.docker/web/nginx.conf) serves the app on port 4200 under its base path, and answers every path under it without a file extension with `index.html`, so the router handles it. It serves `<base path>build-info.json` with `Cache-Control: no-store`. Run a container of the image at <http://localhost:4200>:

```bash
docker run --rm -p 4200:4200 dndmapp/web:local
```

Build the image under another base path, and open the app at <http://localhost:4200/pr-42/> once the container runs:

```bash
BASE_HREF=/pr-42/ pnpm moon run web:image
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

Lint the TypeScript and the templates with [ESLint](https://eslint.org), [`typescript-eslint`](https://typescript-eslint.io), and [`angular-eslint`](https://github.com/angular-eslint/angular-eslint). The task fails on any finding, warnings included, and [`eslint.config.ts`](eslint.config.ts) holds the rules:

```bash
pnpm moon run web:lint
```
