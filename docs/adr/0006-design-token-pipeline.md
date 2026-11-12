# 0006. A moon task generates committed CSS custom properties from the Penpot tokens

- **Status:** Accepted
- **Date:** 2026-11-12
- **Built in:** [#207](https://github.com/dnd-mapp/dnd-mapp/issues/207)

## Context

[ADR 0001](0001-ui-and-token-packages.md) puts the design tokens in `@dnd-mapp/design-tokens`, but leaves open how they get there from Penpot. The Design system file holds them in six sets: `primitives`, `base`, `color/dark`, `color/light`, `viewport/desktop`, and `viewport/mobile`. Its Dark and Light themes each list `primitives`, `base`, and their color set, while Desktop and Mobile each list their viewport set. Every component and both themes will read the CSS that comes out of them, so its formats, names, and units are hard to change once components exist.

Penpot 2.19.1 shapes the pipeline in three ways:

- Its export uses DTCG syntax (`$value`, `$type`, and `{alias}` references) inside the multi-set format of Tokens Studio, with Tokens Studio type names such as `sizing` and `fontFamilies`. [`@tokens-studio/sd-transforms`](https://github.com/tokens-studio/sd-transforms) reads this format for [Style Dictionary](https://styledictionary.com).
- It [accepts only `px` and `%`](https://github.com/penpot/penpot/blob/2.19.1/common/src/app/common/files/tokens.cljc) in token values, so a size can't be typed in `rem`. [#206](https://github.com/dnd-mapp/dnd-mapp/issues/206) gives the sizes without a unit an explicit `px`.
- It has no released way to export tokens outside its UI. The `get-file-tokens` RPC arrives in Penpot 2.20.

## Decision

`design-tokens:build`, a moon task, reads `tokens.json` with Style Dictionary and sd-transforms and writes `css/tokens.css`, as [#207](https://github.com/dnd-mapp/dnd-mapp/issues/207) builds it:

- **Penpot is the source of truth.** `tokens.json` is the single-file export of the Design system file, committed as Penpot writes it and never edited by hand. A token changes in Penpot first, as [Source of truth](../design.md#source-of-truth) asks of every design. The build splits the sets in memory before Style Dictionary reads them, since one tree of every set would let `color/light` overwrite `color/dark`.
- **The generated CSS is committed.** `design-tokens:check` runs the build and fails CI when the committed `tokens.css` differs from its output. No package in the workspace has a build step, as [ADR 0004](0004-modules-compile-from-source.md) records, so the app, Storybook, and the Docker image read the CSS like any other source file. A token change also shows in review as a CSS diff, which reads more easily than the JSON.
- **The output is CSS custom properties only**, in one `tokens.css` that the package exports as `@dnd-mapp/design-tokens/tokens.css`. It holds one block for `primitives` and `base`, and one for each theme set. Components read tokens through `var()` and nothing else; other formats come when something needs them. [#209](https://github.com/dnd-mapp/dnd-mapp/issues/209) picks the selector of each block, so the first build puts the sets of Penpot's active themes, Dark and Desktop, on `:root`.
- **Every set becomes variables, primitives included.** Semantic tokens reference primitives with `var()`, so a reader can trace where a value comes from. Components use semantic tokens only: a value that no semantic token holds gets one in Penpot first. [#207](https://github.com/dnd-mapp/dnd-mapp/issues/207) adds the rule to the [Design](../design.md) guide, and review enforces it.
- **Names follow the token path in kebab case**, with no prefix and no set name: `color.accent.default` becomes `--color-accent-default`. A token in `color/dark` and its twin in `color/light` share one name, and the theme decides its value. sd-transforms names variables in camel case by default, so the build adds `name/kebab`.
- **Sizes are `px` in Penpot and `rem` in CSS**, at 16 px to 1 rem, so they scale with the reader's font size setting. Letter spacing converts too: `1.5px` becomes `0.09375rem`. Border widths stay `px`, so a 1 px line neither rounds to 0 nor grows with the text.
- **Typography tokens become one variable per property**, such as `--typography-h1-font-size: var(--font-size-h1)`. The `font` shorthand can't hold letter spacing or text case, and separate variables keep their references. Shadows stay one variable each, such as `--shadow-raised`, since `box-shadow` takes the whole value.
- **Tokens are exported by hand** until a one-click sync exists: whoever changes a token in Penpot exports `tokens.json`, runs `design-tokens:build`, and commits both in one pull request. [#208](https://github.com/dnd-mapp/dnd-mapp/issues/208) weighs the designs of the sync, which waits on Penpot 2.20.

## Alternatives

- **The zip export, with one file per set.** Style Dictionary could then read each set from its own file, and the build would need no split. But the `get-file-tokens` RPC that a sync will call returns the single file, so the sync would need a script to split it, and each hand export would have to match that script's output. The single file is what both write as is.
- **CSS built into an ignored `dist/`.** `web:start`, `web:build`, the Docker image, Storybook, and every component test would have to depend on the token task, and `design-tokens` would be the first package with a build step. Review would also see no CSS diff for a token change.
- **One file per theme**, loaded on demand. It saves a few hundred bytes, and costs a request and extra work on each theme switch.
- **Primitives kept internal**, with their values written into the semantic tokens. No component could reach a primitive then, but the CSS would no longer show which primitive a value comes from. The rule that components use semantic tokens only covers the same risk in review.
- **A `--dma-` prefix.** The app is the only reader of the variables, and Angular CDK keeps to its own `--cdk-` names, so a prefix would guard against no clash.
- **`em` for letter spacing**, so the spacing grows with the text it spaces. A letter spacing token doesn't record the font size it goes with, so the build would need a hand-kept table to convert it. `rem` still scales with the reader's font size setting.
- **One `font` variable per typography token.** The shorthand would drop letter spacing and text case.

## Consequences

- Each token change takes several steps by hand: export, build, commit, and a pull request. `design-tokens:check` catches a skipped build, but no check notices a skipped export, which leaves the repository behind Penpot. [#208](https://github.com/dnd-mapp/dnd-mapp/issues/208) removes the hand steps.
- The repository holds every token twice, as JSON and as CSS, which `design-tokens:check` keeps in step.
- Any component can read a primitive, so the rule that components use semantic tokens only rests on review until a lint rule enforces it.
- Sizes read `px` in the Inspect tab of Penpot and `rem` in the browser, so comparing them takes the factor of 16.
- The build relies on sd-transforms reading the export of Penpot, which neither project documents. A change to the export format can break the build.
- Custom properties can't appear in media queries, so a breakpoint needs a format of its own. [#209](https://github.com/dnd-mapp/dnd-mapp/issues/209) records the one the viewport switch uses.

## Revisit when

- Penpot accepts `rem` in token values, so the values in Penpot and in the CSS can match.
- Something other than CSS needs the tokens, such as a native app or TypeScript code.
- Review keeps missing primitives in component styles, so keeping them internal would pay off.
- The export of Penpot changes in a way that sd-transforms no longer reads.
