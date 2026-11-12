# 0009. moon starts Storybook through the Angular CLI builders

- **Status:** Accepted
- **Date:** 2026-11-12
- **Built in:** [#258](https://github.com/dnd-mapp/dnd-mapp/pull/258)

## Context

[ADR 0007](0007-storybook-on-vite.md) has moon run `storybook dev` and `storybook build`, and rejects the Angular CLI builders of `@storybook/angular-vite` as adding nothing the CLI lacks. They do add one thing: a `styles` option that lists global stylesheets, which neither the CLI nor the framework options in `.storybook/main.ts` offer.

Since [#211](https://github.com/dnd-mapp/dnd-mapp/issues/211), the preview needs `tokens.css`, so each story reads the same variables as the app. Without `styles`, `.storybook/preview.ts` imports the stylesheet, and `tsconfig.storybook.json` takes the client types of Vite so the import type-checks.

## Decision

The `storybook` and `build-storybook` targets in `packages/ui/web/angular.json` use `@storybook/angular-vite:start-storybook` and `@storybook/angular-vite:build-storybook`, and moon runs them as `ng run ui-web:storybook` and `ng run ui-web:build-storybook`. The reasons:

- **Global styles live in config.** The `styles` of both targets list `@dnd-mapp/design-tokens/tokens.css`, as the build target of an Angular app lists its global stylesheets. The preview holds the decorators only, and its tsconfig needs no Vite types.
- **The same build.** The builders read `.storybook/main.ts` and start the same Vite server as the CLI. On 10.6.6, the preset adds an import of each style to the top of the preview, so the stylesheet loads and reloads as an import there would.

The rest of ADR 0007 stands.

## Alternatives

- **The Storybook CLI, with an import in the preview**, as ADR 0007 planned. It needs no `angular.json` target, but each global stylesheet becomes an import in code, and the Storybook tsconfig needs the client types of Vite.
- **A `<link>` in `.storybook/preview-head.html`, with `staticDirs` serving the file.** It bypasses Vite, so a change to the tokens needs a manual reload, and `ui-web` would serve a folder of another package.

## Consequences

- Storybook starts through the Angular CLI, which `ui-web` already installs for its unit-test builder.
- The options of a run sit in two files: `angular.json` holds the port, the output folder, and the styles, and `.storybook/main.ts` holds the rest of the Storybook config.
- `styles` belongs to a framework in preview, so a minor release may change it. A stylesheet that stops loading fails no check, so look at the theme toolbar after a Storybook update.

## Revisit when

- The Storybook CLI, or the framework options in `.storybook/main.ts`, take global stylesheets.
- `@storybook/angular-vite` drops or changes its Angular CLI builders.
