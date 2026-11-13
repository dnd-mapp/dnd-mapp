# Web UI

The UI components of the [web client](../../../apps/web/README.md), which every app and module of the web platform may import. [ADR 0001](../../../docs/adr/0001-ui-and-token-packages.md) records why they live in a package of their own. [`angular.json`](angular.json) configures the Angular CLI, and [`moon.yml`](moon.yml) defines the tasks below.

## What belongs here

A component belongs here when it is presentational: it takes its content through content projection and its state through inputs, and uses no router or app state. The app or domain module that uses it does the wiring. The package imports only packages for the whole workspace, as the [dependency rules](../../../docs/architecture.md#dependency-rules) require, so it stays below `core-web` and the domain modules.

[Build the design system in code](https://github.com/dnd-mapp/dnd-mapp/issues/199) adds the components, in the build order of the Component inventory in [Penpot](../../../docs/design.md#from-design-to-code). Each one takes its name from Penpot, and keeps its files in a folder of that name under [`src/components/`](src/components): the component, its template and styles, its spec, and its stories.

| Component  | Selector   | Variants                                              |
|:-----------|:-----------|:------------------------------------------------------|
| [Logo][lo] | `dma-logo` | `kind`: `full` or `mark`. `size`: `large` or `small`. |

[lo]: src/components/logo/logo.component.ts

## Entry points

| Import             | Source                         | Exports                                 |
|:-------------------|:-------------------------------|:----------------------------------------|
| `@dnd-mapp/ui-web` | [`src/index.ts`](src/index.ts) | `LogoComponent`, `LogoKind`, `LogoSize` |

The `exports` of [`package.json`](package.json) point at the TypeScript sources, and each app compiles them as part of its own build, as [Architecture](../../../docs/architecture.md#modules-compile-from-source) describes. [`ng-package.json`](ng-package.json) is what the unit-test builder reads, and what an `ng build` with ng-packagr would package as is.

## Tasks

Run each task from the repository root.

| Task              | Command                                                                              | Runs in CI | Cached |
|:------------------|:-------------------------------------------------------------------------------------|:----------:|:------:|
| `test`            | `ng test`                                                                            |     no     |   no   |
| `test-ci`         | `ng test -c ci`                                                                      |    yes     |  yes   |
| `storybook`       | `ng run ui-web:storybook`                                                            |     no     |   no   |
| `build-storybook` | `ng run ui-web:build-storybook`                                                      |    yes     |  yes   |
| `typecheck`       | `tsc --project tsconfig.node.json && ngc --project tsconfig.storybook.json --noEmit` |    yes     |  yes   |
| `lint`            | `eslint . --max-warnings 0`                                                          |    yes     |  yes   |

Run the unit tests with [Vitest](https://vitest.dev) in headless Chromium, rerun them when a file changes, and open the Vitest UI:

```bash
pnpm moon run ui-web:test
```

Run the unit tests once, as CI does. On GitHub Actions, the `github-actions` reporter annotates the pull request with each failing test:

```bash
pnpm moon run ui-web:test-ci
```

Both test tasks collect coverage into `coverage/ui-web/` and fail when statements, branches, functions, or lines drop below 80%. The tests run in Chromium through [Playwright](https://playwright.dev), which [Development](../../../docs/development.md#browsers) installs.

Serve [Storybook](#storybook) at <http://localhost:6006>, which reloads on each change:

```bash
pnpm moon run ui-web:storybook
```

Build the static Storybook into `dist/storybook/`. The build fails on a story that does not compile, such as one with a broken import, so CI runs it:

```bash
pnpm moon run ui-web:build-storybook
```

Check the types of what no build checks: the config files, which `ng test` leaves out and ESLint, Vitest, and Storybook load without checking, and the components, stories, and their templates, which Storybook compiles without checking. [`tsconfig.node.json`](tsconfig.node.json) extends the `node.json` preset of [`@dnd-mapp/config-typescript`](../../config-typescript/README.md), and `ngc` checks the templates of [`tsconfig.storybook.json`](tsconfig.storybook.json) as the app build does:

```bash
pnpm moon run ui-web:typecheck
```

Lint the TypeScript and the templates with [ESLint](https://eslint.org), [`typescript-eslint`](https://typescript-eslint.io), and [`angular-eslint`](https://github.com/angular-eslint/angular-eslint). The task fails on any finding, warnings included, and [`eslint.config.ts`](eslint.config.ts) holds the rules:

```bash
pnpm moon run ui-web:lint
```

## Storybook

[Storybook](https://storybook.js.org) shows each component on its own, in the states its stories set up, so it can be checked against its [Penpot design](../../../docs/design.md). The stories document the components; the Vitest specs test them. [ADR 0007](../../../docs/adr/0007-storybook-on-vite.md) records why it runs on the Vite framework of Storybook, which is in preview, and [ADR 0009](../../../docs/adr/0009-storybook-through-angular-cli.md) why moon starts it through the Angular CLI.

- Put each story next to its component, as `<name>.stories.ts`, so the glob in [`.storybook/main.ts`](.storybook/main.ts) picks it up.
- Import `Meta` and `StoryObj` from `@storybook/angular-vite`.
- Set up the providers that every story needs in [`.storybook/preview.ts`](.storybook/preview.ts), with the `applicationConfig` decorator. Storybook runs the stories zoneless, as the app does.
- Check each story in both color schemes and both viewports. The `styles` of the Storybook targets in [`angular.json`](angular.json) load [`tokens.css`](../../design-tokens/README.md) into the preview, and [`.storybook/preview.css`](.storybook/preview.css) paints the canvas in the page background of the theme, as the web app does. The theme toolbar switches Dark and Light by setting `data-theme` on `<html>`, and the viewport control switches Mobile and Desktop, as [Themes](../../../docs/design.md#themes) describes.
