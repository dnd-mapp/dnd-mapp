# Testing

This guide covers what the tests of every project share: how each kind of project runs its tests, what the test tasks do, how to test a component, and the setup file for tests in Chromium. Each project's README covers the helpers and conventions of its own tests.

## How each project runs its tests

| Kind of project                              | Tests                                                       | Run in   | Projects                                             |
|:---------------------------------------------|:------------------------------------------------------------|:---------|:-----------------------------------------------------|
| A TypeScript package for the whole workspace | Unit tests, with [Vitest](https://vitest.dev)               | Node.js  | `common`, `design-tokens`, `release`, `testing-node` |
| An Angular module                            | Unit tests, with `ng test` and Vitest                       | Chromium | `core-web`, `ui-web`                                 |
| An app                                       | End-to-end tests, with [Playwright](https://playwright.dev) | Chromium | `web-e2e`, for `web`                                 |

Put each unit test next to the code it tests, as `<name>.spec.ts`. Vitest runs the tests in a random order, and its globals, such as `describe` and `expect`, need no import.

A package for the whole workspace configures Vitest in its `vitest.config.ts`. An Angular module runs its tests through the Angular unit-test builder, `@angular/build:unit-test`, which builds the tests and hands them to Vitest. The `test` target in its `angular.json` sets the options of the builder, such as coverage, and points `runnerConfig` at its `vitest.config.ts`, which sets up the browser. Vitest drives Chromium through Playwright, in the build that [Browsers](development.md#browsers) installs.

An app has no unit tests, since its code lives in the modules it builds on. Its end-to-end tests live in `e2e/<app>` and cover what only the running app shows. [Web end-to-end tests](../e2e/web/README.md) describes them and their tasks, `e2e` and `e2e-ci`.

## Test tasks

Every project with unit tests has a `test` and a `test-ci` task:

- `test` runs the tests in watch mode, and reruns them when a file changes. An Angular module also serves the [Vitest UI](https://vitest.dev/guide/ui), at the port that `api.port` in its `vitest.config.ts` sets. Vitest prints the address of the UI with a token, which the UI needs, so open the address that it prints.
- `test-ci` runs the tests once with the `dot` and `github-actions` reporters, as CI does. On GitHub Actions, the `github-actions` reporter annotates the pull request with each failing test.

| Project    | Vitest UI                           |
|:-----------|:------------------------------------|
| `core-web` | <http://localhost:4300/__vitest__/> |
| `ui-web`   | <http://localhost:4301/__vitest__/> |

Give a new Angular module the next free port, so the watchers of every module can run side by side.

Both tasks collect coverage with V8, print a summary, and write an HTML report: to `coverage/` in a package for the whole workspace, and to `coverage/<project>/` in an Angular module. They fail when statements, branches, functions, or lines drop below 80%. A package for the whole workspace sets coverage in its `vitest.config.ts`, and an Angular module in the `test` target of its `angular.json`.

## Test helpers

Two packages hold the helpers that the tests of more than one project share, one for each place the tests run:

- [`@critsource/testing-node`](../packages/testing-node/README.md) mocks built-in modules of Node.js, such as `node:fs` and the git it runs through `node:child_process`, for the tests in Node.js. Tests in Chromium cannot use it.
- `@critsource/ui-web/testing`, the `/testing` entry point of [`ui-web`](../packages/ui/web/README.md#entry-points), holds `setupTestEnvironment`, the harnesses of its components, and the other helpers of the tests in Chromium, as [Testing a component](#testing-a-component) describes.

## Testing a component

Test each component through a host component that places it in a template, as an app does, and read the component through its [component harness](https://angular.dev/guide/testing/component-harnesses-overview) rather than through its DOM. Set up the test with `setupTestEnvironment` from `@critsource/ui-web/testing`. Given a `host` and a `harness`, it configures the testing module with the `providers` and `imports` that the test passes, creates the host, and returns its fixture, a harness loader, and the harness of the component:

```ts
@Component({
    template: `<dma-logo [kind]="kind()" />`,
    imports: [LogoComponent],
})
class TestComponent {
    public readonly kind = signal<LogoKind>(LogoKind.Full);
}

const { fixture, harness, harnessLoader } = await setupTestEnvironment({
    host: TestComponent,
    harness: LogoHarness,
});
```

A test without a component, such as the test of a service, passes the providers alone and injects what it tests:

```ts
setupTestEnvironment({ providers: [provideBrowserStorage(new InMemoryStorage())] });
const service = TestBed.inject(ThemeService);
```

### Harnesses

Put the harness of each component in `testing/harnesses/<name>.harness.ts` of the package that holds the component. The package exports its harnesses through its `/testing` entry point, from `testing/index.ts`, so the tests of the packages that build on it read the component through the same harness. The entry point has an `ng-package.json` of its own, and stays out of the production sources.

### Design tokens

The components read the [design tokens](../packages/design-tokens/README.md), so their tests run against `tokens.css`. List it under `setupFiles` in the `vitest.config.ts` of the module, as [`packages/ui/web/vitest.config.ts`](../packages/ui/web/vitest.config.ts) does. The unit-test builder takes no `styles` from the ng-packagr `build` target that the tests build from, and Vite injects the CSS that a setup file imports into the page. Leave `fonts.css` out, since the fonts load after the first render and text widths would then depend on timing. Add the `css` group of the `design-tokens` project to the inputs of both test tasks, as [Modules compile from source](architecture.md#modules-compile-from-source) describes.

The tests run in Dark, the theme that `tokens.css` applies without a media query, whatever color scheme the system prefers. The `vitest.config.ts` of each Angular module sets `colorScheme: 'dark'` in the context options of the Playwright provider. A spec sets no stand-in values for the tokens. It reads each expected color with `readColorToken` while the test runs, so the color follows the theme that the test runs in:

```ts
expect(await harness.getLook()).toEqual({
    background: readColorToken('--color-accent-default'),
    borderColor: 'rgba(0, 0, 0, 0)',
    color: readColorToken('--color-foreground-on-accent'),
});
```

`readColorToken` throws when `tokens.css` doesn't define the token. In Dark, `--color-background-hover` and `--color-background-raised` share a color, so a test that compares two states checks a property that tells them apart, such as a border.

## The pointer setup file

Load [`packages/ui/web/testing/pointer.ts`](../packages/ui/web/testing/pointer.ts) in every project whose tests run in Chromium. Before each test, it moves the pointer to the bottom-right corner of the viewport, where no test renders a component. Without it, the pointer stays where the previous test left it, and Chrome hovers a component that the next test renders in that spot a frame later. A test that expects the default look then fails in some orders.

The `/testing` entry point of `ui-web` doesn't export the file. List it under `setupFiles` of the `test` target in `angular.json`, by its path from the project, so the unit-test builder compiles it with the tests, as [`packages/core/web/angular.json`](../packages/core/web/angular.json) does:

```json
"setupFiles": ["../../ui/web/testing/pointer.ts"]
```

A project outside `ui-web` then adds `@critsource/ui-web` to its `devDependencies`, and the `sources` group of the `ui-web` project to the inputs of both test tasks.

The setup file moves the pointer before the test renders anything. A test that hovers a component and then checks the default look still moves the pointer away itself.
