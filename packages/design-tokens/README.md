# Design tokens

The design tokens of D&D Mapp, which the [design system](../../docs/design.md) in Penpot holds: the colors, sizes, type, and shadows that every component and theme reads. [ADR 0001](../../docs/adr/0001-ui-and-token-packages.md) records why the tokens live in a package of their own.

`tokens.json` is the single-file token export of the Design system file, committed as Penpot writes it. Change a token in Penpot and export it again, as [Design tokens](../../docs/design.md#design-tokens) describes, rather than editing the file.

`css/tokens.css` holds the CSS custom properties that the `build` task generates from `tokens.json`, and the package exports it as `@dnd-mapp/design-tokens/tokens.css`. The task also writes the desktop breakpoint from [`src/breakpoints.ts`](src/breakpoints.ts) to `scss/breakpoints.scss`, which the package exports as `@dnd-mapp/design-tokens/breakpoints.scss`. [ADR 0006](../../docs/adr/0006-design-token-pipeline.md) records how the pipeline works and why, [ADR 0008](../../docs/adr/0008-theme-mapping.md) how the themes switch, and [ADR 0010](../../docs/adr/0010-font-loading.md) how the app loads its fonts.

## The CSS

Each token becomes a variable named after its path in kebab case, with no prefix and no set name: `color.accent.default` becomes `--color-accent-default`. A token that references another one keeps the reference as `var()`, so the CSS shows which primitive each semantic token takes its value from.

- **Sets.** `primitives`, `base`, `color/dark`, and `viewport/mobile` go on `:root`, each set in a rule of its own. `color/light` follows twice, once for a device that prefers light and once for `data-theme="light"`, and `viewport/desktop` last, inside the desktop media query. [Themes](../../docs/design.md#themes) lists the selectors. Each rule resolves its references against the sets on `:root`, with its own set in place of the one it overrides, so `color/light` never overwrites a token of `color/dark` in the build.
- **Color scheme.** The rules of `color/dark` and `color/light` each set `color-scheme` to their scheme.
- **Sizes** are in `rem` at 16 px to 1 rem, letter spacing included. Border widths stay in `px`.
- **Typography tokens** become one variable per property, such as `--typography-h1-font-size: var(--font-size-h1)`.
- **Shadows** become one `box-shadow` value each, such as `--shadow-raised`.
- **Descriptions** from Penpot become a comment above their variable.

## Tasks

Run each task from the repository root.

| Task        | Command                                                                                                   | Runs in CI | Cached |
|:------------|:----------------------------------------------------------------------------------------------------------|:----------:|:------:|
| `build`     | `node src/main.ts`                                                                                        |     no     |  yes   |
| `check`     | `node src/main.ts --check`                                                                                |    yes     |  yes   |
| `test`      | `vitest`                                                                                                  |     no     |   no   |
| `test-ci`   | `vitest run --reporter dot --reporter github-actions`                                                     |    yes     |  yes   |
| `typecheck` | `tsc --project tsconfig.lib.json && tsc --project tsconfig.spec.json && tsc --project tsconfig.node.json` |    yes     |  yes   |
| `lint`      | `eslint . --max-warnings 0`                                                                               |    yes     |  yes   |

Generate `css/tokens.css` from `tokens.json` with [Style Dictionary](https://styledictionary.com) and [`@tokens-studio/sd-transforms`](https://github.com/tokens-studio/sd-transforms), which read the export of Penpot, and `scss/breakpoints.scss` from `src/breakpoints.ts`. Run it after each export, or a change to the breakpoint, and commit the files it writes:

```bash
pnpm moon run design-tokens:build
```

Check that the committed `css/tokens.css` and `scss/breakpoints.scss` match what `build` generates, as CI does. The task writes nothing, and names the first line that differs:

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

The `typecheck` task checks the sources, the tests, and the config files each with its own tsconfig, as [Architecture](../../docs/architecture.md#typescript-configs) describes. The `lint` task lints them with the `typescript` preset and the `tsdoc` config of [`@dnd-mapp/config-eslint`](../config-eslint/README.md):

```bash
pnpm moon run design-tokens:typecheck
```

```bash
pnpm moon run design-tokens:lint
```
