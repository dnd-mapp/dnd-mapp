# 0007. Storybook runs on its own Vite framework for Angular

- **Status:** Accepted
- **Date:** 2026-11-12
- **Built in:** [#244](https://github.com/dnd-mapp/dnd-mapp/pull/244)

## Context

[ADR 0001](0001-ui-and-token-packages.md) puts Storybook in `ui-web`, so each component can be checked against its Penpot design. It leaves open which Storybook framework builds the stories. Three frameworks support Angular 22, and each takes a different builder:

| Framework                                                                                      | Builder   | Maintained by     | Angular                                  | Status  |
|:-----------------------------------------------------------------------------------------------|:----------|:------------------|:-----------------------------------------|:--------|
| [`@storybook/angular`](https://www.npmjs.com/package/@storybook/angular/v/10.6.6)              | webpack 5 | Storybook         | `>=18 <23`                               | Stable  |
| [`@analogjs/storybook-angular`](https://analogjs.org/docs/integrations/storybook)              | Vite      | Analog, community | `>=18 <23`, through `@storybook/angular` | Stable  |
| [`@storybook/angular-vite`](https://storybook.js.org/docs/get-started/frameworks/angular-vite) | Vite 8    | Storybook         | `>=21 <23`                               | Preview |

The workspace shapes the choice in three ways:

- The apps build with `@angular/build`, which runs esbuild and Vite, and no project uses webpack.
- `strictPeerDependencies` fails `pnpm install` on a missing peer, so every required peer of a framework becomes a dependency of `ui-web`.
- The app runs zoneless, without `zone.js`.

## Decision

`ui-web` runs Storybook 10.6 on `@storybook/angular-vite`, which compiles the stories with [`@analogjs/vite-plugin-angular`](https://www.npmjs.com/package/@analogjs/vite-plugin-angular). The reasons:

- **No webpack.** It builds with Vite, as the apps do with `@angular/build`, and none of its required peers pull in webpack or `@angular-devkit/build-angular`.
- **Maintained by Storybook.** It ships with every Storybook release, at the version of `storybook` itself. The `storybook` catalog updates the two together.
- **Zoneless by default**, as the app runs.
- **No Compodoc.** It reads the inputs and outputs of each component from its TypeScript sources to build the controls and the docs.

Two choices go with it:

- **moon runs the Storybook CLI.** `ui-web:storybook` runs `storybook dev` and `ui-web:build-storybook` runs `storybook build`, both from [`.storybook/main.ts`](../../packages/ui/web/.storybook/main.ts). The framework also offers Angular CLI builders, but these read the same config and take no build target, so an `angular.json` target would only wrap the CLI.
- **`typecheck` checks the stories.** Storybook compiles them in JIT mode, and AOT mode with `jit: false` checks no more. Tested on 10.6.6, a story that passes a number to a `string` input and a template that reads an unknown property both build. `ui-web:typecheck` therefore runs `ngc` over [`tsconfig.storybook.json`](../../packages/ui/web/tsconfig.storybook.json), which checks the components, the stories, and their templates as the app build does. CI runs `build-storybook` as well, which fails on what only a build can catch, such as a broken import.

Storybook is hosted on GitHub Pages, as [#195](https://github.com/dnd-mapp/dnd-mapp/issues/195) builds it. Pages serves one site per repository, so the `main` build and a preview for each pull request share one tree, such as a `gh-pages` branch with `main` at the root and each preview under `pr/<number>/`. #195 also decides whether pull requests from forks get previews.

Once [#207](https://github.com/dnd-mapp/dnd-mapp/issues/207) generates `@dnd-mapp/design-tokens/tokens.css`, the preview loads it, so the stories read the same variables as the app.

## Alternatives

- **`@storybook/angular`.** It is stable and has supported Angular for years. But it builds with webpack 5, and lists `@angular-devkit/build-angular` and `@angular/platform-browser-dynamic` as required peers. Under `strictPeerDependencies`, `ui-web` would install a second Angular build system that no app uses.
- **`@analogjs/storybook-angular`.** It builds with Vite, but lists `@storybook/angular` as a required peer, so it brings the same webpack peers along. It also comes from a different project than `storybook`, so the two can fall out of step on an update. Storybook's own Vite framework builds on the same Analog plugin.
- **The Angular CLI builders of `@storybook/angular-vite`.** They would let `ng run ui-web:storybook` start Storybook. moon already runs every task, so the builders add a target to `angular.json` and nothing the CLI lacks.

## Consequences

- The framework is in preview until Storybook 11, so its APIs and defaults may change in a minor release. Renovate merges the minor updates of the `storybook` catalog once the checks pass, so `build-storybook` and `typecheck` in CI are the guard.
- `@storybook/angular-vite` lists `@angular/animations` as a required peer, which Angular 22 deprecates. pnpm installs it for `ui-web` only, and no component imports it.
- A story with a type or template error fails `typecheck`, not `build-storybook`. Both run in CI, but on your machine `storybook dev` shows such a story without a complaint.
- The docs of a component list its inputs and outputs from source, with two limits that the [framework docs](https://storybook.js.org/docs/get-started/frameworks/angular-vite) name: code snippets don't follow the values of the controls, and an input typed `T | undefined` gets an object control, so type it with `?` instead.
- The framework needs Angular 21 or later and Vite 8 or later, which the workspace already meets.

## Revisit when

- Storybook 11 marks the framework stable, or changes its APIs in a way that breaks the stories.
- Storybook checks the types and templates of the stories in its own build, so `typecheck` no longer needs `ngc`.
- The apps move off `@angular/build`, so the builder of Storybook no longer matches theirs.
