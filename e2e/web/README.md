# Web end-to-end tests

The end-to-end tests of the [web client](../../apps/web/README.md): [Playwright](https://playwright.dev) tests that run against the app in Chromium. [`playwright.config.ts`](playwright.config.ts) configures Playwright, and [`moon.yml`](moon.yml) defines the tasks below.

## Tasks

Run each task from the repository root.

| Task        | Command                     | Runs in CI | Cached |
|:------------|:----------------------------|:----------:|:------:|
| `e2e`       | `playwright test --ui`      |     no     |   no   |
| `e2e-ci`    | `playwright test`           |    yes     |   no   |
| `typecheck` | `tsc`                       |    yes     |  yes   |
| `lint`      | `eslint . --max-warnings 0` |    yes     |  yes   |

Open the Playwright UI to run and debug the tests. The tests use the dev server at <https://localhost.www.dndmapp.dev:4200> when it is already up, and start one otherwise. They need the hosts entry of the [one-time HTTPS setup](../../README.md#development):

```bash
pnpm moon run web-e2e:e2e
```

Run the tests once with the CI settings, against the [web image](../../apps/web/README.md) behind [Caddy](https://caddyserver.com), as CI does. Playwright retries each failing test twice and records a trace on the first retry. The HTML report lands in `playwright-report/`. The task needs Docker, and no hosts entry or mkcert certificate:

```bash
pnpm moon run web-e2e:e2e-ci
```

[`global-setup.ts`](global-setup.ts) starts the stack of [`compose.yaml`](compose.yaml) and stops it once the tests finish:

- `web` runs `dndmapp/web:edge`, the image of the latest commit of `main`, or the image that `WEB_IMAGE` names. The stack pulls it on every run, except an image with the `local` tag, which no registry holds.
- `caddy` serves the app at `https://localhost.www.dndmapp.dev:4200`, the URL of the dev server, with a certificate of its internal CA. [`Caddyfile`](Caddyfile) configures it.
- `playwright` runs a Playwright server in the [Playwright image](https://playwright.dev/docs/docker) of the version in the lockfile. The tests connect to it, so the browser runs inside the network of the stack, where a network alias resolves the host of the app to Caddy.

To test your local changes to the web app, build `dndmapp/web:local` and point the stack at it:

```bash
pnpm moon run web:image
WEB_IMAGE=dndmapp/web:local pnpm moon run web-e2e:e2e-ci
```

CI sets `WEB_IMAGE` to the image that it pushed for the commit, and uploads the HTML report when a test fails. A commit that pushes no web image tests `dndmapp/web:edge`.

Check the types of the tests and the Playwright config, which Playwright itself runs without checking. [`tsconfig.json`](tsconfig.json) extends the `node.json` preset of [`@dnd-mapp/config-typescript`](../../packages/config-typescript/README.md):

```bash
pnpm moon run web-e2e:typecheck
```

Lint the tests and the config files with [ESLint](https://eslint.org), [`typescript-eslint`](https://typescript-eslint.io), and the rules of [`eslint-plugin-playwright`](https://github.com/mskelton/eslint-plugin-playwright). The task fails on any finding, warnings included, and [`eslint.config.ts`](eslint.config.ts) holds the rules:

```bash
pnpm moon run web-e2e:lint
```

The tests run in the full Chromium build of the Playwright version in the `playwright` catalog, in the new headless mode. `e2e` uses the build that the [Development](../../README.md#development) section of the root README installs, and `e2e-ci` the one in the Playwright image.
