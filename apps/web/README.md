# Web

The web client of D&D Mapp: an [Angular](https://angular.dev) app that renders in the browser only. [`angular.json`](angular.json) configures the Angular CLI, and [`moon.yml`](moon.yml) defines the tasks below.

## Tasks

Run each task from the repository root.

| Task      | Command                     | Runs in CI | Cached |
|:----------|:----------------------------|:----------:|:------:|
| `start`   | `ng serve`                  |     no     |   no   |
| `build`   | `ng build`                  |    yes     |  yes   |
| `test`    | `ng test`                   |     no     |   no   |
| `test-ci` | `ng test -c ci`             |    yes     |  yes   |
| `lint`    | `eslint . --max-warnings 0` |    yes     |  yes   |

Serve the app at <http://localhost:4200>, and rebuild it when a file changes:

```bash
pnpm moon run web:start
```

Build the app for production into `dist/web/`:

```bash
pnpm moon run web:build
```

Run the unit tests with [Vitest](https://vitest.dev) in headless Chromium, rerun them when a file changes, and open the Vitest UI:

```bash
pnpm moon run web:test
```

Run the unit tests once, as CI does. On GitHub Actions, the `github-actions` reporter annotates the pull request with each failing test:

```bash
pnpm moon run web:test-ci
```

Both test tasks collect coverage into `coverage/web/` and fail when statements, branches, functions, or lines drop below 80%.

Lint the TypeScript and the templates with [ESLint](https://eslint.org), [`typescript-eslint`](https://typescript-eslint.io), and [`angular-eslint`](https://github.com/angular-eslint/angular-eslint). The task fails on any finding, warnings included, and [`eslint.config.ts`](eslint.config.ts) holds the rules:

```bash
pnpm moon run web:lint
```

The tests run in Chromium through [Playwright](https://playwright.dev). Install the browser once, from this folder:

```bash
pnpm exec playwright install chromium
```
