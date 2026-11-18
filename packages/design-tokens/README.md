# Design tokens

The design tokens of D&D Mapp, which the [design system](../../docs/design.md) in Penpot holds: the colors, sizes, type, and shadows that every component and theme reads. [ADR 0001](../../docs/adr/0001-ui-and-token-packages.md) records why the tokens live in a package of their own.

`tokens.json` is the single-file token export of the Design system file, committed as Penpot writes it. Change a token in Penpot and export it again, as [Design tokens](../../docs/design.md#design-tokens) describes, rather than editing the file. [`src/fonts.ts`](src/fonts.ts) configures the fonts, and [`src/breakpoints.ts`](src/breakpoints.ts) the desktop breakpoint. The [`build`](#tasks) task generates the files that the package exports from these three. [ADR 0006](../../docs/adr/0006-design-token-pipeline.md) records how the pipeline works and why, [ADR 0008](../../docs/adr/0008-theme-mapping.md) how the themes switch, and [ADR 0010](../../docs/adr/0010-font-loading.md) how the app loads its fonts.

## Using the package

Add the package to the `dependencies` of a project. It exports the four files below. `build` generates the CSS files and the Sass partial, and the repository commits them, so a project reads them without running the task:

| Export                                     | Holds                                                                      |
|:-------------------------------------------|:---------------------------------------------------------------------------|
| `@dnd-mapp/design-tokens/tokens.css`       | The CSS custom properties of the tokens, as [The CSS](#the-css) describes. |
| `@dnd-mapp/design-tokens/fonts.css`        | The `@font-face` rules of the fonts, as [The fonts](#the-fonts) describes. |
| `@dnd-mapp/design-tokens/breakpoints.scss` | The desktop breakpoint, as the Sass variable `$breakpoint-desktop`.        |
| `@dnd-mapp/design-tokens/breakpoints`      | The desktop breakpoint, as the constant `desktopBreakpoint`, for a script. |

An Angular project loads both CSS files for the whole page through the `styles` option of each builder in `angular.json` that renders it, as [`apps/web/angular.json`](../../apps/web/angular.json) does for `build` and [`packages/ui/web/angular.json`](../ui/web/angular.json) for Storybook:

```json
"styles": [
    "@dnd-mapp/design-tokens/fonts.css",
    "@dnd-mapp/design-tokens/tokens.css",
    "src/styles.scss"
]
```

A component then reads a token through `var()`, such as `var(--color-background-page)`, and uses the semantic tokens only, as [Design tokens](../../docs/design.md#design-tokens) asks. No custom property can appear in a media query, so a component whose styles change at the desktop breakpoint imports the Sass partial instead, as [`button.component.scss`](../ui/web/src/components/button/button.component.scss) does:

```scss
@use '@dnd-mapp/design-tokens/breakpoints.scss' as breakpoints;

@media (min-width: breakpoints.$breakpoint-desktop) {
    :host {
        display: inline-flex;
    }
}
```

A script that follows the breakpoint imports the constant instead, which Node.js and the Angular build read from the TypeScript source:

```ts
import { desktopBreakpoint } from '@dnd-mapp/design-tokens/breakpoints';

const desktop = matchMedia(`(min-width: ${desktopBreakpoint})`);
```

moon hashes the inputs of a project's own tasks only, so a change to the tokens would rerun none of the tasks that read them. The `css` file group of the `design-tokens` project holds the files that the package exports. Add it to the inputs of each task that builds, serves, tests, or checks the styles or scripts that read them, as [`apps/web/moon.yml`](../../apps/web/moon.yml) and [`packages/ui/web/moon.yml`](../ui/web/moon.yml) do:

```yaml
inputs:
    - project: "design-tokens"
      group: "css"
```

## The CSS

Each token becomes a variable named after its path in kebab case, with no prefix and no set name: `color.accent.default` becomes `--color-accent-default`. A token that references another one keeps the reference as `var()`, so the CSS shows which primitive each semantic token takes its value from.

- **Sets.** `primitives` and `base` share one rule on `:root`, and `color/dark` and `viewport/mobile` each follow in a rule of their own on `:root`. `color/light` follows twice, once for a device that prefers light and once for `data-theme="light"`, and `viewport/desktop` last, inside the desktop media query. [Themes](../../docs/design.md#themes) lists the selectors. Each rule resolves its references against the sets on `:root`, with its own set in place of the one it overrides, so `color/light` never overwrites a token of `color/dark` in the build.
- **Color scheme.** The rules of `color/dark` and `color/light` each set `color-scheme` to their scheme.
- **Sizes** are in `rem` at 16 px to 1 rem, letter spacing included. Border widths stay in `px`.
- **Typography tokens** become one variable per property, such as `--typography-h1-font-size: var(--font-size-h1)`.
- **Shadows** become one `box-shadow` value each, such as `--shadow-raised`.
- **Font families** become the full stack of their family in the [font config](#the-fonts), such as `--font-family-body: 'Source Sans 3', 'Source Sans 3 Fallback', sans-serif`.
- **Descriptions** from Penpot become a comment above their variable.

## The fonts

`css/fonts.css` loads the families of the `font.family` tokens from the [Fontsource](https://fontsource.org) packages that the package lists under `dependencies`. [`src/fonts.ts`](src/fonts.ts) names each family's package, styles, fallback font, and generic family, and [Fonts](../../docs/design.md#fonts) describes how to add a family or a weight.

- **Faces.** Each subset and style of a family gets an `@font-face` rule, with the subsets, weight ranges, and `unicode-range` values that the `wght.css` and `wght-italic.css` of its package declare. Each rule names the family as its token does, such as `Source Sans 3`, uses `font-display: swap`, and points at the variable WOFF2 file through a relative path into `node_modules`. The Angular build and Storybook emit each file with a hashed name.
- **Fallbacks.** Each family gets a fallback face on `local('Arial')` or `local('Courier New')`, such as `Source Sans 3 Fallback`, whose `size-adjust`, `ascent-override`, `descent-override`, and `line-gap-override` the build computes from the font files with [Capsize](https://github.com/seek-oss/capsize).
- **Format.** Prettier formats the file with the config of the repository, so `format-check` passes on what the build writes.

## Tasks

[`moon.yml`](moon.yml) defines the tasks below, and the project inherits `lint` from [`.moon/tasks/eslint.yml`](../../.moon/tasks/eslint.yml). Run each task from the repository root.

| Task        | Command                                                                                                   | Runs in CI | Cached |
|:------------|:----------------------------------------------------------------------------------------------------------|:----------:|:------:|
| `build`     | `node src/main.ts`                                                                                        |     no     |  yes   |
| `check`     | `node src/main.ts --check`                                                                                |    yes     |  yes   |
| `test`      | `vitest`                                                                                                  |     no     |   no   |
| `test-ci`   | `vitest run --reporter dot --reporter github-actions`                                                     |    yes     |  yes   |
| `typecheck` | `tsc --project tsconfig.lib.json && tsc --project tsconfig.spec.json && tsc --project tsconfig.node.json` |    yes     |  yes   |
| `lint`      | `eslint . --max-warnings 0`                                                                               |    yes     |  yes   |

Generate the files that the package exports. Run it after each export, each change to the fonts or the breakpoint, and each update of a Fontsource package, and commit the files it writes:

- `css/tokens.css`, from `tokens.json` and `src/breakpoints.ts`, with [Style Dictionary](https://styledictionary.com) and [`@tokens-studio/sd-transforms`](https://github.com/tokens-studio/sd-transforms), which read the export of Penpot.
- `css/fonts.css`, from `src/fonts.ts` and the CSS and font files of the Fontsource packages, with Capsize for the metrics of the fallbacks and Prettier for the format.
- `scss/breakpoints.scss`, from `src/breakpoints.ts`, which the build script writes without a tool.

```bash
pnpm moon run design-tokens:build
```

Check that the committed `css/tokens.css`, `css/fonts.css`, and `scss/breakpoints.scss` match what `build` generates, as CI does. The task writes nothing, and names the first line that differs:

```bash
pnpm moon run design-tokens:check
```

Run the unit tests with [Vitest](https://vitest.dev), and rerun them when a file changes:

```bash
pnpm moon run design-tokens:test
```

Run the unit tests once, as CI does. Both test tasks collect coverage into `coverage/` and fail when statements, branches, functions, or lines drop below 80%:

```bash
pnpm moon run design-tokens:test-ci
```

The `typecheck` task checks the sources, the tests, and the config files each with its own tsconfig, as [Architecture](../../docs/architecture.md#typescript-configs) describes. The `lint` task lints them with the `typescript` preset and the `tsdoc` config of [`@dnd-mapp/config-eslint`](../config-eslint/README.md). `moon.yml` adds the `sources` group of `common` to the inputs of both, since the build script imports the helpers and the type-aware rules read their types:

```bash
pnpm moon run design-tokens:typecheck
```

```bash
pnpm moon run design-tokens:lint
```
