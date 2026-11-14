# Web UI

The UI components of the [web client](../../../apps/web/README.md), which every app and module of the web platform may import. [ADR 0001](../../../docs/adr/0001-ui-and-token-packages.md) records why they live in a package of their own. [`angular.json`](angular.json) configures the Angular CLI, and [`moon.yml`](moon.yml) defines the tasks below.

## What belongs here

A component belongs here when it is presentational: it takes its content through content projection and its state through inputs, and uses no router or app state. The app or domain module that uses it does the wiring. Theme picker is the one exception: it reads and saves the choice through [`ThemeService`](#theme), as [ADR 0001](../../../docs/adr/0001-ui-and-token-packages.md) records. The package imports only packages for the whole workspace, as the [dependency rules](../../../docs/architecture.md#dependency-rules) require, so it stays below `core-web` and the domain modules.

[Build the design system in code](https://github.com/dnd-mapp/dnd-mapp/issues/199) adds the components, in the build order of the Component inventory in [Penpot](../../../docs/design.md#from-design-to-code). Each one takes its name from Penpot, and keeps its files in a folder of that name under [`src/components/`](src/components): the component, its template and styles, its types, its spec, its stories, its docs page, and an `index.ts` that lists what the package exports of it. [`src/index.ts`](src/index.ts) takes one `export *` line per component.

| Component    | Selector                           | Variants                                                                                                                                             |
|:-------------|:-----------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------|
| Icon         | [`dma-icon-<glyph>`][ic]           | One component per glyph: `menu`, `close`, `arrow-right`, `arrow-down`, `plus`, `minus`, `external`, `sun`, `moon`, `monitor`, `check`, and `github`. |
| Link         | [`a[dma-link]`][li]                | `kind`: `inline`, `standalone`, or `quiet`.                                                                                                          |
| Logo         | [`dma-logo`][lo]                   | `kind`: `full` or `mark`. `size`: `large` or `small`.                                                                                                |
| Theme picker | [`fieldset[dma-theme-picker]`][tp] | `display`: `labels` or `icons`.                                                                                                                      |

[ic]: src/components/icon/index.ts
[li]: src/components/link/link.component.ts
[lo]: src/components/logo/logo.component.ts
[tp]: src/components/theme-picker/theme-picker.component.ts

## Theme

`ThemeService` owns the color scheme that the reader picks, the one piece of state in this package that [ADR 0001](../../../docs/adr/0001-ui-and-token-packages.md) allows. [ADR 0008](../../../docs/adr/0008-theme-mapping.md) records how the choice maps to the themes of `tokens.css`. Inject the service where the reader picks a theme, such as the Theme picker:

- `theme` is a signal of the choice: `Theme.System`, `Theme.Dark`, or `Theme.Light`.
- `setTheme(theme)` applies a choice. Dark and Light save it under `dma-theme` through [`StorageService`](#storage) and set `data-theme` on `<html>`. System removes both, so the page follows `prefers-color-scheme` again.
- A missing or unknown saved value counts as System. When the choice can't be saved, it still applies until the page reloads.
- The service watches `dma-theme`, so a choice made in one tab applies in every open tab.
- During prerendering, it reports System and changes nothing.

The service reads the saved choice when it starts, but leaves `data-theme` alone until the reader picks a theme. An inline boot script in the `<head>` of [`apps/web/src/index.html`](../../../apps/web/src/index.html) sets it from `dma-theme` before the stylesheets load, so a reader who picked Light sees no flash of Dark while the app boots. The script can't import from this package, so it repeats the key, the values, and the default storage of `BROWSER_STORAGE`, and [`boot-script.spec.ts`](src/theme/boot-script.spec.ts) runs it against the service to keep the two in step. The test tasks list `index.html` as an input for that reason. Once the app gets a Content Security Policy, the script needs a hash in `script-src`.

## Storage

`StorageService` reads and writes the storage of the reader's browser for the settings that live there, such as the theme. It keeps no state of its own. The `BROWSER_STORAGE` token picks the storage: `localStorage` by default, and `null` during prerendering or when the browser blocks storage for the site.

Each method takes a key of `StorageKey`, so a misspelled key fails to compile and no two features share one. Add a key to [`storage.types.ts`](src/storage/storage.types.ts) before you save under it.

- `get(key)` returns the saved value, or `null` when there is none or the storage can't be read.
- `set(key, value)` and `remove(key)` return whether they worked, since the browser can block storage or run out of room. None of the methods throws.
- `watch(key, listener)` calls `listener` with the new value each time another tab changes `key`, and `null` when that tab removes it or clears the storage. It stops when the app is destroyed, or when you call the function it returns.

The methods use `tryCatchSync` from [`@dnd-mapp/common`](../../common/README.md), so the inputs of the tasks below list the sources of that package.

## Entry points

| Import                     | Source                                 | Exports                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|:---------------------------|:---------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `@dnd-mapp/ui-web`         | [`src/index.ts`](src/index.ts)         | One `Icon<Glyph>Component` per glyph, such as `IconMenuComponent`, `LinkComponent`, `LinkKind`, `DEFAULT_LINK_KIND`, `linkKindAttr`, `LogoComponent`, `LogoKind`, `LogoSize`, `DEFAULT_LOGO_KIND`, `DEFAULT_LOGO_SIZE`, `logoKindAttr`, `logoSizeAttr`, `ThemePickerComponent`, `ThemePickerDisplay`, `DEFAULT_THEME_PICKER_DISPLAY`, `themePickerDisplayAttr`, `ThemeService`, `Theme`, `DEFAULT_THEME`, `THEME_ATTRIBUTE`, `parseTheme`, `StorageService`, `StorageListener`, `StorageKey`, `BROWSER_STORAGE` |
| `@dnd-mapp/ui-web/testing` | [`testing/index.ts`](testing/index.ts) | `IconHarness`, `LinkHarness`, `LinkFocusRing`, `LogoHarness`, `ThemePickerHarness`, `ThemePickerLook`, `ThemePickerFocusRing`, `InMemoryStorage`, `provideBrowserStorage`, `providePlatformId`, `setupTestEnvironment`, `TestEnvironment`, `TestEnvironmentOptions`, `ComponentTestEnvironmentOptions`                                                                                                                                                                                                          |

The `exports` of [`package.json`](package.json) point at the TypeScript sources, and each app compiles them as part of its own build, as [Architecture](../../../docs/architecture.md#modules-compile-from-source) describes. The `testing` entry point holds the [component harnesses](https://angular.dev/guide/testing/component-harnesses-overview) for the tests of this package and the apps and modules that use it, and stays out of the production sources. Each entry point has an `ng-package.json`, which the unit-test builder reads and which an `ng build` with ng-packagr would package as is.

## Testing

Set up each test with `setupTestEnvironment`, which configures the testing module with the `providers` and `imports` that the test passes.

Test each component through a host component that places it in a template, as an app does, and read it through its harness in [`testing/harnesses/`](testing/harnesses). Given a `host` and a `harness`, `setupTestEnvironment` also creates the host and returns its fixture, a harness loader, and the harness of the component. It configures the `providers` and `imports` before it creates the host, so a component test can pass them too:

```ts
const { fixture, harness, harnessLoader } = await setupTestEnvironment({
    host: TestComponent,
    harness: LogoHarness,
    providers: [provideBrowserStorage(new InMemoryStorage())],
});
```

A test without a component, such as the test of a service, passes the providers alone and injects what it tests:

```ts
setupTestEnvironment({ providers: [provideBrowserStorage(new InMemoryStorage())] });
const service = TestBed.inject(ThemeService);
```

Provide an `InMemoryStorage` through `provideBrowserStorage`, so a test leaves the storage of the browser and the other tests alone. Set its `blocked` to make it throw, as a browser does when it blocks storage for the site. `providePlatformId('server')` runs a test as prerendering does. A test of a change in another tab still needs `localStorage`, since the browser accepts only its own storage in a `StorageEvent`.

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

[Storybook](https://storybook.js.org) shows each component on its own, in the states its stories set up, so it can be checked against its [Penpot design](../../../docs/design.md). The stories and the docs pages document the components; the Vitest specs test them. [ADR 0007](../../../docs/adr/0007-storybook-on-vite.md) records why it runs on the Vite framework of Storybook, which is in preview, and [ADR 0009](../../../docs/adr/0009-storybook-through-angular-cli.md) why moon starts it through the Angular CLI.

The Storybook of `main` is online at <https://dnd-mapp.github.io/dnd-mapp/>. Each pull request that changes it publishes a preview under `pr/<number>/` and links it as a deployment, as [CI](../../../docs/ci.md#storybook) describes.

- Put each story next to its component, as `<name>.stories.ts`, so the glob in [`.storybook/main.ts`](.storybook/main.ts) picks it up.
- Import `Meta` and `StoryObj` from `@storybook/angular-vite`.
- Describe each input that takes one value of a constant object, such as `LogoKind`, with `radioArgType` from [`.storybook/arg-types.ts`](.storybook/arg-types.ts). It gives the input a radio control and a table row with its description, its values, and its default, which Storybook cannot read from the component without Compodoc.
- Draw a hover or focus state in a story of its own with the `pseudo` parameter of [`storybook-addon-pseudo-states`](https://github.com/chromaui/storybook-addon-pseudo-states), such as `parameters: { pseudo: { hover: true } }` or `{ focusVisible: true }`. The addon applies the styles of the state without a pointer or keyboard, so the story stays in that state for comparison with Penpot.
- Write the docs page of each component as `<name>.mdx` next to its stories, with `<Meta of={...} />` pointing at them, so Storybook shows it as the Docs entry of the component. Import the doc blocks, such as `Canvas` and `Controls`, from `@storybook/addon-docs/blocks`.
- Set up the providers that every story needs in [`.storybook/preview.ts`](.storybook/preview.ts), with the `applicationConfig` decorator. Storybook runs the stories zoneless, as the app does.
- Check each story in both color schemes and both viewports. The `styles` of the Storybook targets in [`angular.json`](angular.json) load [`fonts.css` and `tokens.css`](../../design-tokens/README.md) into the preview, and [`.storybook/preview.css`](.storybook/preview.css) paints the canvas in the page background of the theme and sets its text in the body typography, as the web app does. The theme toolbar switches Dark and Light by setting `data-theme` on `<html>`, and the viewport control switches Mobile and Desktop, as [Themes](../../../docs/design.md#themes) describes.
