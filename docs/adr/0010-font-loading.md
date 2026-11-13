# 0010. The token package hosts the fonts and generates their `@font-face` rules

- **Status:** Accepted
- **Date:** 2026-11-13
- **Built in:** [#213](https://github.com/dnd-mapp/dnd-mapp/issues/213)

## Context

The `font.family` tokens in the `base` set of the Design system file name three families: `Manrope` for headings, `Source Sans 3` for body text, and `JetBrains Mono` for game notation. [ADR 0006](0006-design-token-pipeline.md) turns them into custom properties, but nothing loads the fonts, so the web app and Storybook show the browser's default font. The packages, the generated CSS, and the font stacks chosen now reach every component and both builds, so they are hard to change later.

Five facts shape the choice:

- The typography tokens use two weights of each family: 700 and 800 of Manrope, 400 and 600 of Source Sans 3, and 500 and 700 of JetBrains Mono. The `font.weight` tokens offer five weights, from 400 to 800.
- Penpot renders text with the first family of a `fontFamilies` token only, so a stack typed into Penpot would add nothing there.
- [Fontsource](https://fontsource.org/docs/getting-started/variable) ships each family as an npm package. Its CSS names the variable families with a suffix, such as `Manrope Variable`, which matches no font in Penpot.
- Chrome since [version 86](https://developer.chrome.com/blog/http-cache-partitioning) and Firefox since [version 85](https://blog.mozilla.org/security/2021/01/26/supercookie-protections/) keep a cache per site, so a font from a shared CDN no longer saves a download.
- All three families are under the [SIL Open Font License 1.1](https://openfontlicense.org/open-font-license-official-text/), which allows bundling and redistributing them.

## Decision

[#213](https://github.com/dnd-mapp/dnd-mapp/issues/213) builds the fonts into `@dnd-mapp/design-tokens`:

- **The app hosts its fonts itself.** No reader's browser contacts a third party for them.
- **Fontsource supplies the files.** `@fontsource-variable/manrope`, `@fontsource-variable/source-sans-3`, and `@fontsource-variable/jetbrains-mono` are `dependencies` of the package. The web image installs with `--filter "@dnd-mapp/web..."`, which takes them in, and dependency updates reach them like any other package.
- **Variable WOFF2 files cover every weight.** Each family loads upright and italic, except Manrope, which has no italic. Each face covers every subset Fontsource ships, behind its `unicode-range`, so a browser downloads only the subsets a page uses.
- **`design-tokens:build` generates `css/fonts.css`** from a font config, which names each family's package, styles, fallback font, and generic family. The build reads the subsets and their `unicode-range` from Fontsource's CSS. `design-tokens:check` fails CI when the committed `fonts.css` is stale, as it does for `tokens.css`.
- **The `@font-face` rules use the family names of the tokens**: `Manrope`, `Source Sans 3`, and `JetBrains Mono`. The CSS and Penpot then name each family the same way.
- **Every face uses `font-display: swap`**, so text shows at once in a fallback. Each family gets a fallback face on `local("Arial")` or `local("Courier New")`, such as `Source Sans 3 Fallback`. The build computes its `size-adjust`, `ascent-override`, `descent-override`, and `line-gap-override` from the font files, so the swap [moves little text](https://developer.chrome.com/blog/font-fallbacks).
- **The token build expands each `fontFamilies` token into a stack** from the font config, such as `--font-family-body: "Source Sans 3", "Source Sans 3 Fallback", sans-serif`. Penpot keeps the single family it renders.
- **`fonts.css` points at the font files through relative paths** into the package's `node_modules`. The Angular build and Storybook resolve each `url()` and emit the file with a hashed name. This holds because the package is private and never published.
- **The app preloads no font for now.** Preloading waits until measurements show that the fonts load too late.

## Alternatives

- **Google Fonts or another CDN.** The page would need no packages and no generated CSS. But every visit would send the reader's IP address to a third party, which the Munich Regional Court [ruled unlawful](https://www.gesetze-bayern.de/Content/Document/Y-300-Z-BECKRS-B-2022-N-612) for Google Fonts in 2022. The shared cache that once made a CDN faster no longer exists.
- **WOFF2 files downloaded from upstream and committed.** The repository would hold binary files that only a hand download updates, and dependency updates would never reach them.
- **Static files for the weights the tokens use.** For the Latin subset, the two static weights already outweigh the one variable file: 27.9 KB against 24.8 KB for Manrope, 31.4 KB against 28.9 KB for Source Sans 3, and 43.7 KB against 40.4 KB for JetBrains Mono. Each new weight would also need a new file.
- **A hand-written `fonts.css`.** Every Fontsource update could change the subsets and their `unicode-range` values, and someone would copy them again by hand.
- **Fontsource's family names**, such as `Manrope Variable`. The tokens would name a family Penpot can't render, or the CSS and Penpot would name it differently.
- **`font-display: optional`.** It avoids the swap, but a reader whose first visit loads the fonts slowly sees the fallback for that whole page.
- **Fixed fallback metrics**, typed into the config. They go stale when an update changes a font's metrics, and nothing notices.
- **Font stacks typed into Penpot.** Penpot renders the first family only, so the stack would sit in every token unused and add no fallback there.
- **Font files copied into the package**, so `fonts.css` would point at files inside it. The package could then be published, but the build would duplicate every file, for a package that is never published.
- **Preloading the fonts.** `index.html` can't name a hashed file, so preloading needs copies at unhashed paths, which lose the cache busting of the hashed names. No measurement calls for it yet.

## Consequences

- No third party sees the readers' requests for fonts, and the web image serves the font files itself.
- Each Fontsource update needs `design-tokens:build` and a commit of `fonts.css`. `design-tokens:check` fails a dependency update that skips it.
- A device without Arial or Courier New, such as most Linux and Android devices, skips the fallback face. Its readers see the generic family without metric overrides, so the swap moves text more.
- A heading set in italics shows Manrope slanted by the browser, since Manrope has no italic.
- The package can't be published as it is, since `fonts.css` points into its own `node_modules`.
- The Inspect tab of Penpot shows one family where the CSS holds a stack.
- Without a preload, the browser finds the fonts only once it has parsed the CSS, so readers on a slow connection see the fallback first.

## Revisit when

- `@dnd-mapp/design-tokens` gets published, or a project outside the workspace reads it.
- Measurements show that the fonts delay the largest contentful paint or shift the layout, so a preload would pay off.
- Penpot renders the whole stack of a `fontFamilies` token, so the stacks could live in Penpot.
- The tokens settle on one weight per family, so static files would be smaller.
- Fontsource stops shipping variable files, or changes the CSS the build reads.
