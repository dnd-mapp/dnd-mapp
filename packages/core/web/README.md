# Web core

The core of the [web client](../../../apps/web/README.md): the root component, the app config, and the routes that the domain modules of the web client lazy-load from. [`angular.json`](angular.json) configures the Angular CLI, and [`moon.yml`](moon.yml) defines the tasks below.

## Entry points

| Import                       | Source                                 | Exports                      |
|:-----------------------------|:---------------------------------------|:-----------------------------|
| `@dnd-mapp/core-web`         | [`src/index.ts`](src/index.ts)         | `RootComponent`, `appConfig` |
| `@dnd-mapp/core-web/testing` | [`testing/index.ts`](testing/index.ts) | `RootHarness`                |

The `exports` of [`package.json`](package.json) point at the TypeScript sources, and the web client compiles them as part of its own build, so the package needs no build of its own. The Angular compiler skips the files that TypeScript resolves through `node_modules`, so [`tsconfig.base.json`](../../../tsconfig.base.json) at the root of the repository maps the package name to [`src/index.ts`](src/index.ts) with a path, and each project that imports the package extends it. The `testing` entry point holds the [component harnesses](https://angular.dev/guide/testing/component-harnesses-overview) for the tests of this package and the packages that build on it, and stays out of the production sources. Each entry point has an `ng-package.json`, which the unit-test builder reads and which an `ng build` with ng-packagr would package as is.

## Tasks

Run each task from the repository root.

| Task      | Command                     | Runs in CI | Cached |
|:----------|:----------------------------|:----------:|:------:|
| `test`    | `ng test`                   |     no     |   no   |
| `test-ci` | `ng test -c ci`             |    yes     |  yes   |
| `lint`    | `eslint . --max-warnings 0` |    yes     |  yes   |

Run the unit tests with [Vitest](https://vitest.dev) in headless Chromium, rerun them when a file changes, and open the Vitest UI:

```bash
pnpm moon run core-web:test
```

Run the unit tests once, as CI does. On GitHub Actions, the `github-actions` reporter annotates the pull request with each failing test:

```bash
pnpm moon run core-web:test-ci
```

Both test tasks collect coverage into `coverage/core-web/` and fail when statements, branches, functions, or lines drop below 80%.

Lint the TypeScript and the templates with [ESLint](https://eslint.org), [`typescript-eslint`](https://typescript-eslint.io), and [`angular-eslint`](https://github.com/angular-eslint/angular-eslint). The task fails on any finding, warnings included, and [`eslint.config.ts`](eslint.config.ts) holds the rules:

```bash
pnpm moon run core-web:lint
```

The tests run in Chromium through [Playwright](https://playwright.dev), which the [Development](../../../README.md#development) section of the root README installs.
