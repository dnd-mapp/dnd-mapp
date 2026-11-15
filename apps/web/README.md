# Web

The web client of D&D Mapp: an [Angular](https://angular.dev) app that renders in the browser only. [`angular.json`](angular.json) configures the Angular CLI, and [`eslint.config.ts`](eslint.config.ts) applies the `angular` preset of [`@dnd-mapp/config-eslint`](../../packages/config-eslint/README.md), which holds the rules.

## What belongs here

The app bootstraps the root component and app config of [`@dnd-mapp/core-web`](../../packages/core/web/README.md), and holds only what makes it deployable. Every feature goes in `core-web` or a module that it builds on, as [Architecture](../../docs/architecture.md#projects) describes:

- [`src/main.ts`](src/main.ts) bootstraps the app.
- [`src/index.html`](src/index.html) holds the page shell and its metadata. An inline boot script in its `<head>` applies the theme that the reader saved before the stylesheets load. [Theme](../../packages/ui/web/README.md#theme) in the `ui-web` README explains the script, and a spec there keeps it in step with `ThemeService`.
- The global styles load in the order of `angular.json`: `fonts.css` and `tokens.css` of [`@dnd-mapp/design-tokens`](../../packages/design-tokens/README.md), then [`src/styles.scss`](src/styles.scss).
- [`public/`](public) holds the icons, the image of link previews, and the [build info](#build-info), which the build copies as they are.

## Build info

`build-info.json` reports the commit and version of a build, so a deploy can check which build an environment runs. [`public/build-info.json`](public/build-info.json) holds the placeholders `dev` for the commit and `0.0.0-dev` for the version, which the dev server serves as they are. [`scripts/build-info.ts`](scripts/build-info.ts) stamps the values of `COMMIT_SHA` and `VERSION` into the copy in `dist/web/`, and fails when either variable is empty.

## Image

[`.docker/web/Dockerfile`](../../.docker/web/Dockerfile) packages the app in a Docker image that serves it with [nginx](https://nginx.org). The first stage runs on the platform of the builder. It installs pnpm with its [install script](https://pnpm.io/installation), installs the dependencies with the pnpm store in a cache mount, builds the app with `moon run web:build`, and stamps `build-info.json` with `scripts/build-info.ts`. The final stage copies the bundle into the nginx image.

The `web` target of [`.docker/bake.hcl`](../../.docker/bake.hcl) builds the image with [Docker Bake](https://docs.docker.com/build/bake/) for the platform of your machine, and tags it `dndmapp/web:local`. Set `TAGS` to a comma-separated list of other tags, of which the first becomes the version. Bake passes these variables from the environment to the Dockerfile as build arguments:

| Variable     | Purpose                                                        | Default                 |
|:-------------|:---------------------------------------------------------------|:------------------------|
| `BASE_HREF`  | The base path that the app is served under, such as `/pr-42/`. | `/`                     |
| `COMMIT_SHA` | The commit that `build-info.json` reports.                     | The commit of `HEAD`    |
| `VERSION`    | The version that `build-info.json` reports.                    | The first tag in `TAGS` |

`BASE_HREF` starts and ends with `/`, and holds only letters, digits, and `._~-`. Bake fails on any other base path, and on an empty tag in `TAGS`.

The target sets these labels, of which the `org.opencontainers.image` ones follow the [OCI annotations](https://github.com/opencontainers/image-spec/blob/main/annotations.md):

| Label                                  | Value                                  |
|:---------------------------------------|:---------------------------------------|
| `maintainer`                           | `D&D Mapp`                             |
| `org.opencontainers.image.title`       | `D&D Mapp web`                         |
| `org.opencontainers.image.description` | `The web client of D&D Mapp.`          |
| `org.opencontainers.image.licenses`    | `MIT`                                  |
| `org.opencontainers.image.source`      | `https://github.com/dnd-mapp/dnd-mapp` |
| `org.opencontainers.image.url`         | `https://github.com/dnd-mapp/dnd-mapp` |
| `org.opencontainers.image.version`     | The first tag in `TAGS`.               |
| `org.opencontainers.image.created`     | The time of the build.                 |

[`.docker/web/nginx.conf`](../../.docker/web/nginx.conf) serves the app on port 4200 under its base path, and answers every path under it without a file extension with `index.html`, so the router handles it. A missing file with an extension, such as a bundle of an older build, gets a `404`. nginx serves `index.html` with `Cache-Control: no-cache`, so browsers load a new release, and `build-info.json` with `Cache-Control: no-store`.

nginx answers `/healthz` with an empty `200` at the root, whatever the base path, without logging the request. The `HEALTHCHECK` of the image requests it, so `docker ps` shows whether the container is `healthy`. Kubernetes ignores `HEALTHCHECK`, so point the probes of a deployment there at `/healthz`.

The image builds on the official `nginx` image but runs nginx as the unprivileged `nginx` user (UID 101) and starts it without the entrypoint scripts of the base image. It needs no added capabilities, writes to `/tmp` only, and runs under any other UID too.

CI builds the image for `linux/amd64` and `linux/arm64` and pushes it to [Docker Hub](https://hub.docker.com/r/dndmapp/web), as [The web image](../../docs/ci.md#the-web-image) describes. There, [`docker/metadata-action`](https://github.com/docker/metadata-action) sets the tags and the version and creation labels, and adds an `org.opencontainers.image.revision` label.

## Docker Hub page

[`.docker/web/README.md`](../../.docker/web/README.md) holds the overview of the image on Docker Hub, for people who pull it, and [`.docker/web/short-description.txt`](../../.docker/web/short-description.txt) its short description. A push to `main` that changes either file publishes both, as [CI](../../docs/ci.md#the-web-image) describes. Neither file is an input of `web:image`, so editing them builds no image.

Docker Hub doesn't resolve relative links, so link from the overview with absolute URLs. Docker Hub keeps at most 100 characters of the short description, and the publishing step truncates a longer one, so the `lint-short-description` task fails on it.

## Testing

The app has no unit tests, since its code lives in `core-web` and the modules that it builds on. The [end-to-end tests](../../e2e/web/README.md) of `web-e2e` run against the dev server, the image, or a deployed environment.

## Tasks

[`moon.yml`](moon.yml) defines the tasks below, and the project inherits `lint` from [`.moon/tasks/eslint.yml`](../../.moon/tasks/eslint.yml) and `lint-changelog` from [`.moon/tasks/changelog.yml`](../../.moon/tasks/changelog.yml). Run each task from the repository root.

| Task                     | Command                                          | Runs in CI | Cached |
|:-------------------------|:-------------------------------------------------|:----------:|:------:|
| `start`                  | `ng serve`                                       |     no     |   no   |
| `build`                  | `ng build`                                       |     no     |  yes   |
| `build-info`             | `node scripts/build-info.ts`                     |     no     |   no   |
| `image`                  | `docker buildx bake --file .docker/bake.hcl web` |     no     |   no   |
| `typecheck`              | `tsc --project tsconfig.node.json`               |    yes     |  yes   |
| `lint`                   | `eslint . --max-warnings 0`                      |    yes     |  yes   |
| `lint-changelog`         | `release lint`                                   |    yes     |  yes   |
| `lint-short-description` | `node scripts/lint-short-description.ts`         |    yes     |  yes   |

Serve the app at <https://localhost.www.dndmapp.dev:4200>, and rebuild it when a file changes. The dev server needs the [one-time HTTPS setup](../../docs/development.md#https-for-the-dev-server) first:

```bash
pnpm moon run web:start
```

Build the app for production into `dist/web/`. The build hashes the names of its files and adds [subresource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) to the scripts and stylesheets it loads. Its budgets warn when the initial bundle passes 500 kB or the styles of a component pass 4 kB, and fail the build at 1 MB and 8 kB:

```bash
pnpm moon run web:build
```

Build the app, and stamp the commit of `HEAD` and the version `local` into its [build info](#build-info):

```bash
pnpm moon run web:build-info
```

Build the [image](#image) from source, which needs a running Docker daemon but no build of the app:

```bash
pnpm moon run web:image
```

Run a container of the image at <http://localhost:4200>:

```bash
docker run --rm -p 4200:4200 dndmapp/web:local
```

Harden a container by dropping every capability and making the root file system read-only, with a tmpfs at `/tmp`:

```bash
docker run --rm -p 4200:4200 --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges dndmapp/web:local
```

Build the image under another base path, and open the app at <http://localhost:4200/pr-42/> once the container runs:

```bash
BASE_HREF=/pr-42/ pnpm moon run web:image
```

Check that the [short description](#docker-hub-page) of the image fits in 100 characters, with [`scripts/lint-short-description.ts`](scripts/lint-short-description.ts):

```bash
pnpm moon run web:lint-short-description
```

Check the types of the config files and of [`scripts/`](scripts), which `ng build` leaves out and Node.js runs without checking. [`tsconfig.node.json`](tsconfig.node.json) extends the `node.json` preset of [`@dnd-mapp/config-typescript`](../../packages/config-typescript/README.md):

```bash
pnpm moon run web:typecheck
```

Lint the TypeScript and the templates with [ESLint](https://eslint.org) and the rules of the `angular` preset. The task fails on any finding, warnings included:

```bash
pnpm moon run web:lint
```

Lint [`CHANGELOG.md`](CHANGELOG.md) against [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) with the [release CLI](../../packages/release/README.md). CI reruns the task when the changelog or the CLI changes:

```bash
pnpm moon run web:lint-changelog
```
