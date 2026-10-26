# Web end-to-end tests

The end-to-end tests of the [web client](../../apps/web/README.md): [Playwright](https://playwright.dev) tests that run against the app in Chromium. [`playwright.config.ts`](playwright.config.ts) configures Playwright, and [`moon.yml`](moon.yml) defines the tasks below.

## Tasks

Run each task from the repository root.

| Task        | Command                     | Runs in CI | Cached |
|:------------|:----------------------------|:----------:|:------:|
| `e2e`       | `playwright test --ui`      |     no     |   no   |
| `e2e-ci`    | `playwright test`           |     no     |  yes   |
| `typecheck` | `tsc`                       |    yes     |  yes   |
| `lint`      | `eslint . --max-warnings 0` |    yes     |  yes   |

Open the Playwright UI to run and debug the tests. The tests use the dev server at <https://localhost.www.dndmapp.dev:4200> when it is already up, and start one otherwise. They need the hosts entry of the [one-time HTTPS setup](../../README.md#development):

```bash
pnpm moon run web-e2e:e2e
```

Run the tests once with the CI settings: Playwright retries each failing test twice and records a trace on the first retry. The HTML report lands in `playwright-report/`:

```bash
pnpm moon run web-e2e:e2e-ci
```

`e2e-ci` cannot start the app yet: it sets `CI`, and moon skips `web:start` when `CI` is set. Once [#51](https://github.com/dnd-mapp/dnd-mapp/issues/51) containerizes the app, `e2e-ci` will start a container of the app image instead, and CI will run it.

Check the types of the tests and the Playwright config, which Playwright itself runs without checking. [`tsconfig.json`](tsconfig.json) holds the compiler options:

```bash
pnpm moon run web-e2e:typecheck
```

Lint the tests and the config files with [ESLint](https://eslint.org), [`typescript-eslint`](https://typescript-eslint.io), and the rules of [`eslint-plugin-playwright`](https://github.com/mskelton/eslint-plugin-playwright). The task fails on any finding, warnings included, and [`eslint.config.ts`](eslint.config.ts) holds the rules:

```bash
pnpm moon run web-e2e:lint
```

The tests run in the Chromium build of the Playwright version in the `playwright` catalog. Install it once, from this folder:

```bash
pnpm exec playwright install chromium
```
