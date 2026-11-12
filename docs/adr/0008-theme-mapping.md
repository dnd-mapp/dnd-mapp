# 0008. Media queries and a saved `data-theme` switch the Penpot themes

- **Status:** Accepted
- **Date:** 2026-11-12
- **Built in:** [#210](https://github.com/dnd-mapp/dnd-mapp/issues/210) and [#211](https://github.com/dnd-mapp/dnd-mapp/issues/211)

## Context

[ADR 0006](0006-design-token-pipeline.md) writes each Penpot set to a block of `tokens.css`, but leaves the selector of each block open, so the first build puts Penpot's active themes, Dark and Desktop, on `:root`. The Design system file groups its themes in two: Color scheme holds Dark and Light, and Viewport holds Desktop and Mobile. `tokens.css`, the boot script of the web app, the `ThemeService` of [#210](https://github.com/dnd-mapp/dnd-mapp/issues/210), and the Theme picker of [#224](https://github.com/dnd-mapp/dnd-mapp/issues/224) all depend on those selectors, so they are hard to change once built.

Four facts shape the choice:

- The color sets hold more than colors. `opacity.glow` and `shadow.raised` also differ between Dark and Light.
- The app renders in the browser only, so no server sees the reader's choice, and the page paints before Angular boots.
- Custom properties can't appear in media queries, as ADR 0006 notes.
- Penpot types sizes in `px`, and ADR 0006 converts them to `rem` so they scale with the reader's font size setting.

## Decision

The color scheme:

- **The reader picks System, Dark, or Light** in the Theme picker. System is the default and follows `prefers-color-scheme`, so a device set to light gets the Light theme with no step from the reader.
- **Dark sits on `:root`**, next to `primitives` and `base`. Light applies to `:root:not([data-theme="dark"])` inside `@media (prefers-color-scheme: light)`, and to `:root[data-theme="light"]`. CSS can't join a media query and a selector in one condition, so the Light block appears twice. Both Light selectors outweigh `:root`, so they win wherever they match. System sets no attribute, and a `data-theme` value other than `dark` or `light` behaves like System.
- **Each color block sets `color-scheme`**, `dark` in the Dark block and `light` in both Light blocks, so form controls, scrollbars, and the other parts the browser draws match the theme.

Saving the choice:

- **`localStorage` holds it** under `dma-theme`, as `dark` or `light`. System removes the key, and any other value counts as System, so a stale or hand-edited value can't break the page.
- **An inline script applies it before the first paint.** It sits in the `<head>` of `apps/web/src/index.html` and sets `data-theme` from `dma-theme`, so a reader who picked Light sees no flash of Dark while the app boots. Open tabs follow a change through the `storage` event, which the browser fires in every other tab of the origin.
- **`ThemeService` in `ui-web` owns the choice.** It exposes the choice as a signal, saves it, sets `data-theme`, and listens for `storage`. The Theme picker injects it, and Storybook can run the picker without the app. [ADR 0001](0001-ui-and-token-packages.md) records why this is the one piece of state in `ui-web`.

The viewport:

- **Mobile comes first.** `viewport/mobile` sits on `:root`, and `viewport/desktop` in `@media (min-width: 64em)`. `min-width` includes its value, so a 1024 px window counts as Desktop. An `em` in a media query follows the reader's font size setting, so a reader who enlarges the text keeps the Mobile sizes up to a wider window, as the `rem` sizes grow with it.
- **One constant in the token build sets the breakpoint.** It feeds both the media query and `@dnd-mapp/design-tokens/breakpoints.scss`, which holds `$breakpoint-desktop: 64em`, since no custom property can carry it into a media query. A component style that needs the breakpoint imports the partial.

## Alternatives

- **Following the device only.** The media query alone would switch the scheme, with no picker, no storage, and no boot script. But a reader who wants the app in another scheme than the rest of their device, such as dark at night on a light desktop, couldn't have it, and Penpot designs a Theme picker for that.
- **Dark by default**, the active theme in Penpot. It shows the app as designed first, but a reader whose device asks for light gets a dark page until they find the picker.
- **`light-dark()`.** One block could hold both schemes, and `data-theme` would only set `color-scheme`. But the function takes only colors, so `opacity.glow` and `shadow.raised` would still need the selectors, and the build would write two switches for one choice.
- **A cookie.** A server could read it and write `data-theme` into the HTML, with no inline script. The app renders in the browser only, so the cookie gains nothing, and it would travel with every request.
- **`ThemeService` in `core-web`.** The Theme picker in `ui-web` can't import `core-web`, so it would take the choice through an input and an output. Header, Mobile menu, and Footer would each repeat that wiring, and Storybook couldn't show the picker working on its own.
- **A `1024px` breakpoint.** It matches the Desktop width in Penpot, but ignores the reader's font size setting, so enlarged `rem` sizes could outgrow the Desktop layout at 1024 px.

## Consequences

- `tokens.css` holds the Light block twice. The build writes both from one set, so the copy costs bytes but no upkeep.
- The inline script and `ThemeService` share the key and values without sharing code, since the script can't import from `ui-web`. A spec from [#210](https://github.com/dnd-mapp/dnd-mapp/issues/210) keeps them in step.
- Once the app gets a Content Security Policy, the inline script needs a hash in `script-src`, and every change to the script changes the hash.
- A browser that blocks `localStorage` keeps no choice across visits, so its reader starts on System each time.
- Light is what many readers see first, so a design change in Penpot needs checking in both color schemes.
- A style that needs the breakpoint reads it from the Sass partial, so a plain CSS file would have to repeat `64em`.

## Revisit when

- The app renders on a server, so a cookie could set `data-theme` in the HTML and replace the inline script.
- `light-dark()`, or a successor, accepts values other than colors, so one block could carry both schemes.
- Penpot adds a theme to either group, such as high contrast or tablet, which these selectors have no place for.
- `@custom-media` ships in the browsers the app supports, so a media query can name the breakpoint without the Sass partial.
