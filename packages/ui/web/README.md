# Web UI

The UI components of the [web client](../../../apps/web/README.md), which every app and module of the web platform may import. [ADR 0001](../../../docs/adr/0001-ui-and-token-packages.md) records why they live in a package of their own. [`angular.json`](angular.json) configures the Angular CLI, and [`moon.yml`](moon.yml) defines the tasks below.

## What belongs here

A component belongs here when it is presentational: it takes its content through content projection and its state through inputs, and uses no router or app state. The app or domain module that uses it does the wiring. The package imports only packages for the whole workspace, as the [dependency rules](../../../docs/architecture.md#dependency-rules) require, so it stays below `core-web` and the domain modules.

The package is empty for now. [Build the design system in code](https://github.com/dnd-mapp/dnd-mapp/issues/199) adds the components.

## Entry points

| Import             | Source                         | Exports |
|:-------------------|:-------------------------------|:--------|
| `@dnd-mapp/ui-web` | [`src/index.ts`](src/index.ts) | None    |

The `exports` of [`package.json`](package.json) point at the TypeScript sources, and each app compiles them as part of its own build, as [Architecture](../../../docs/architecture.md#modules-compile-from-source) describes. [`ng-package.json`](ng-package.json) is what the unit-test builder reads, and what an `ng build` with ng-packagr would package as is.

## Tasks

Run each task from the repository root.

| Task        | Command                            | Runs in CI | Cached |
|:------------|:-----------------------------------|:----------:|:------:|
| `typecheck` | `tsc --project tsconfig.node.json` |    yes     |  yes   |
| `lint`      | `eslint . --max-warnings 0`        |    yes     |  yes   |

The package has no `test` or `test-ci` task yet, since the unit-test builder fails when no spec file matches. The first component adds both, as [`core-web`](../../core/web/README.md#tasks) runs them: [Vitest](https://vitest.dev) in headless Chromium, with coverage that fails below 80%. [`angular.json`](angular.json), [`vitest.config.ts`](vitest.config.ts), and [`tsconfig.spec.json`](tsconfig.spec.json) already set the tests up.

Check the types of the config files, which `ng test` leaves out and ESLint and Vitest load without checking. [`tsconfig.node.json`](tsconfig.node.json) extends the `node.json` preset of [`@dnd-mapp/config-typescript`](../../config-typescript/README.md):

```bash
pnpm moon run ui-web:typecheck
```

Lint the TypeScript and the templates with [ESLint](https://eslint.org), [`typescript-eslint`](https://typescript-eslint.io), and [`angular-eslint`](https://github.com/angular-eslint/angular-eslint). The task fails on any finding, warnings included, and [`eslint.config.ts`](eslint.config.ts) holds the rules:

```bash
pnpm moon run ui-web:lint
```
