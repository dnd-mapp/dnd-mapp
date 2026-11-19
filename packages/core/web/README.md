# Web core

The core of the [web client](../../../apps/web/README.md): the root component, the app config, and the routes, which lazy-load the domain modules of the web client. [`angular.json`](angular.json) configures the Angular CLI, and [`eslint.config.ts`](eslint.config.ts) applies the `angular` preset of [`@critsource/config-eslint`](../../config-eslint/README.md), which holds the rules.

## What belongs here

The shell of the web client that its domain modules build on, as [Architecture](../../../docs/architecture.md#projects) describes. A feature goes in the domain module it belongs to, at `packages/<domain>/web`, and a presentational component goes in [`ui-web`](../../ui/web/README.md).

- [`src/config/app.config.ts`](src/config/app.config.ts) holds `appConfig`, which provides the router with the routes.
- [`src/config/app.routes.ts`](src/config/app.routes.ts) holds the routes, which are empty until the first domain module lands.
- `RootComponent`, in [`src/root/`](src/root), is a placeholder until the shell gets its layout.

A domain module adds a route to `app.routes.ts` that loads it with `import()`, such as through `loadChildren`, so the app downloads the module only when a reader opens the route. The domain modules meet only through this router, as the [dependency rules](../../../docs/architecture.md#dependency-rules) require. ESLint lets `core-web` import a domain module of the web platform through `import()` only, and fails on the import unless [`package.json`](package.json) declares the module.

## Using the package

The [web app](../../../apps/web/README.md) adds the package to its `dependencies` and bootstraps `RootComponent` with `appConfig`, as [`apps/web/src/main.ts`](../../../apps/web/src/main.ts) does.

The `exports` of [`package.json`](package.json) point at the TypeScript sources, and the web client compiles them as part of its own build, as [Architecture](../../../docs/architecture.md#modules-compile-from-source) describes. Each entry point has an `ng-package.json`, which the unit-test builder reads and which an `ng build` with ng-packagr would package as is.

## Entry points

| Import                         | Source                                 | Exports                      |
|:-------------------------------|:---------------------------------------|:-----------------------------|
| `@critsource/core-web`         | [`src/index.ts`](src/index.ts)         | `RootComponent`, `appConfig` |
| `@critsource/core-web/testing` | [`testing/index.ts`](testing/index.ts) | `RootHarness`                |

The `testing` entry point holds the [component harnesses](https://angular.dev/guide/testing/component-harnesses-overview) for the tests of this package and the packages that build on it, and stays out of the production sources.

## Testing

The tests load the [pointer setup file](../../../docs/testing.md#the-pointer-setup-file) of `ui-web` through the `setupFiles` of the `test` target in [`angular.json`](angular.json), which moves the pointer away before each test. That is why `ui-web` is in the `devDependencies`, and why both test tasks list its sources as an input.

## Tasks

[`moon.yml`](moon.yml) defines the tasks below, and the project inherits `lint` from [`.moon/tasks/eslint.yml`](../../../.moon/tasks/eslint.yml). Run each task from the repository root.

| Task        | Command                            | Runs in CI | Cached |
|:------------|:-----------------------------------|:----------:|:------:|
| `test`      | `ng test`                          | no         | no     |
| `test-ci`   | `ng test -c ci`                    | yes        | yes    |
| `typecheck` | `tsc --project tsconfig.node.json` | yes        | yes    |
| `lint`      | `eslint . --max-warnings 0`        | yes        | yes    |

Run the unit tests with [Vitest](https://vitest.dev) in headless Chromium, rerun them when a file changes, and open the Vitest UI:

```bash
pnpm moon run core-web:test
```

Run the unit tests once, as CI does. On GitHub Actions, the `github-actions` reporter annotates the pull request with each failing test:

```bash
pnpm moon run core-web:test-ci
```

Both test tasks collect coverage into `coverage/core-web/` and fail when statements, branches, functions, or lines drop below 80%. The tests run in Chromium through [Playwright](https://playwright.dev), which [Development](../../../docs/development.md#browsers) installs.

Check the types of the config files, which `ng test` leaves out and ESLint and Vitest load without checking. [`tsconfig.node.json`](tsconfig.node.json) extends the `node.json` preset of [`@critsource/config-typescript`](../../config-typescript/README.md):

```bash
pnpm moon run core-web:typecheck
```

Lint the TypeScript and the templates with the rules of the `angular` preset. The task fails on any finding, warnings included:

```bash
pnpm moon run core-web:lint
```
