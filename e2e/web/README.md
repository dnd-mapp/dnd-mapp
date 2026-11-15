# Web end-to-end tests

The end-to-end tests of the [web client](../../apps/web/README.md): [Playwright](https://playwright.dev) tests that run against the app in Chromium. [`playwright.config.ts`](playwright.config.ts) configures Playwright, and [`eslint.config.ts`](eslint.config.ts) applies the `playwright` preset of [`@dnd-mapp/config-eslint`](../../packages/config-eslint/README.md), which holds the rules.

## What belongs here

The project tests what only the running app shows: that it boots, and what happens before it does. Each spec in [`src/`](src) covers one area of the app:

| Spec                                   | Covers                                                                                                                         |
|:---------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------|
| [`app.spec.ts`](src/app.spec.ts)       | The app loads and bootstraps.                                                                                                  |
| [`theme.spec.ts`](src/theme.spec.ts)   | The boot script in `index.html` applies a saved Light theme before the app boots, and the app follows the device under System. |

Add a test to the spec of its area, or a new `src/<area>.spec.ts` for a new area. Test the behavior of a component or service in the unit tests of the project that holds it instead.

## Tasks

[`moon.yml`](moon.yml) defines the tasks below, and the project inherits `lint` from [`.moon/tasks/eslint.yml`](../../.moon/tasks/eslint.yml). Run each task from the repository root.

| Task        | Command                     | Runs in CI | Cached |
|:------------|:----------------------------|:----------:|:------:|
| `e2e`       | `playwright test --ui`      |     no     |   no   |
| `e2e-ci`    | `playwright test`           |    yes     |   no   |
| `typecheck` | `tsc`                       |    yes     |  yes   |
| `lint`      | `eslint . --max-warnings 0` |    yes     |  yes   |

Open the Playwright UI to run and debug the tests. The tests reach the dev server at <https://localhost:4200> when it is already up, and start one otherwise, which needs the [one-time HTTPS setup](../../docs/development.md#https-for-the-dev-server). That is the same server as <https://localhost.www.dndmapp.dev:4200>, under a host that the tests need no hosts file entry for:

```bash
pnpm moon run web-e2e:e2e
```

Run the tests once with the CI settings, against the [web image](../../apps/web/README.md#image) behind [Caddy](https://caddyserver.com), as CI does. Playwright retries each failing test twice and records a trace on the first retry. The HTML report lands in `playwright-report/`. The task needs Docker, and no mkcert certificate:

```bash
pnpm moon run web-e2e:e2e-ci
```

[`global-setup.ts`](global-setup.ts) starts the stack of [`compose.yaml`](compose.yaml) and stops it once the tests finish:

- `web` runs `dndmapp/web:edge`, the image of the latest commit of `main` that changed it, or the image that `WEB_IMAGE` names. The stack pulls it on every run, except an image with the `local` tag, which no registry holds.
- `caddy` serves the app at <https://localhost:4200>, on the port of the dev server, with a certificate of its internal CA. [`Caddyfile`](Caddyfile) configures it.

When a server already listens on port 4200, the tests run against that server instead, and the stack stays down. The dev server works, but a container of the web image serves plain HTTP on that port, so the tests fail against it. Stop such a container before you run the task.

To test your local changes to the web app, build `dndmapp/web:local` and point the stack at it:

```bash
pnpm moon run web:image
WEB_IMAGE=dndmapp/web:local pnpm moon run web-e2e:e2e-ci
```

CI sets `WEB_IMAGE` to the image that it pushed for the commit, and tests `dndmapp/web:edge` when it pushed none, as [CI](../../docs/ci.md#pull-requests-and-main) describes.

To test a deployed environment instead, set `BASE_URL` to its URL. The tests then start no stack and use no dev server, and the browser checks the certificate of the environment. A release runs them against staging this way before it reaches production, as [Releasing](../../docs/releasing.md#what-the-release-workflow-checks) describes:

```bash
BASE_URL=https://staging.dndmapp.nl.eu.org/ pnpm moon run web-e2e:e2e-ci
```

Check the types of the tests, `global-setup.ts`, and the config files, which Playwright and ESLint run without checking. [`tsconfig.json`](tsconfig.json) extends the `node.json` preset of [`@dnd-mapp/config-typescript`](../../packages/config-typescript/README.md):

```bash
pnpm moon run web-e2e:typecheck
```

Lint the tests and the config files with [ESLint](https://eslint.org) and the rules of the `playwright` preset, which include those of [`eslint-plugin-playwright`](https://github.com/mskelton/eslint-plugin-playwright). The task fails on any finding, warnings included:

```bash
pnpm moon run web-e2e:lint
```

The tests run in the full Chromium build of the Playwright version in the `playwright` catalog, in the new headless mode. Both test tasks use the build that [Development](../../docs/development.md#browsers) installs.
