# Common helpers

Small, general helpers that any project of D&D Mapp can use. [`moon.yml`](moon.yml) defines the tasks below.

## What belongs here

A helper belongs here when it knows nothing about D&D Mapp, a domain, or a platform: no models or rules of a domain, and no Angular, DOM, or Node.js APIs. Code that the platforms of a domain share goes in the `domain` package of that domain, `packages/<domain>/domain`, as [`CONTRIBUTING.md`](../../CONTRIBUTING.md#projects-tasks-and-dependencies) describes.

## Helpers

| Helper              | Does                                                                                                     |
|:--------------------|:---------------------------------------------------------------------------------------------------------|
| `tryCatch(promise)` | Awaits `promise`, and resolves to its value or to the reason it rejected with, never rejecting.          |
| `tryCatchSync(fn)`  | Calls `fn`, and returns its value or the error it threw, never throwing. Pass a promise to `tryCatch`.   |

Both return a `Result<T>`: `{ ok: true, value }` or `{ ok: false, error }`. Check `ok` to tell the two apart, since JavaScript can throw any value, `undefined` included. The `error` is `unknown` for the same reason. The helpers keep the variable `const` and the happy path flat where a `let` above a `try` block would otherwise take the value:

```ts
import { tryCatch } from '@dnd-mapp/common';

const read = await tryCatch(readFile(path, 'utf8'));

if (!read.ok) {
    throw new Error(`cannot read ${path}`, { cause: read.error });
}
const text = read.value;
```

## Using the package

Add the package to the `dependencies` of a project:

```json
"@dnd-mapp/common": "workspace:*"
```

The `exports` of [`package.json`](package.json) point at the TypeScript sources, so each project compiles the helpers in its own build, and Node.js runs them through type stripping. [`tsconfig.base.json`](../../tsconfig.base.json) maps the package name to [`src/index.ts`](src/index.ts) for the Angular compiler. moon hashes the inputs of a project's own tasks only, so add the package to the inputs of each task that compiles it:

```yaml
inputs:
    - project: "common"
      group: "sources"
```

The sources import each other with the `.ts` extension, as Node.js requires, so the `node` and `angular` presets of [`@dnd-mapp/config-typescript`](../config-typescript/README.md) both allow it.

## Tasks

Run each task from the repository root.

| Task        | Command                                                                                                   | Runs in CI | Cached |
|:------------|:----------------------------------------------------------------------------------------------------------|:----------:|:------:|
| `test`      | `vitest`                                                                                                  |     no     |   no   |
| `test-ci`   | `vitest run --reporter dot --reporter github-actions`                                                     |    yes     |  yes   |
| `typecheck` | `tsc --project tsconfig.lib.json && tsc --project tsconfig.spec.json && tsc --project tsconfig.node.json` |    yes     |  yes   |
| `lint`      | `eslint . --max-warnings 0`                                                                               |    yes     |  yes   |

Run the unit tests with [Vitest](https://vitest.dev), and rerun them when a file changes:

```bash
pnpm moon run common:test
```

Run the unit tests once, as CI does:

```bash
pnpm moon run common:test-ci
```

Both test tasks collect coverage into `coverage/` and fail when statements, branches, functions, or lines drop below 80%.

The `typecheck` task checks the sources, the tests, and the config files each with its own tsconfig ([`tsconfig.lib.json`](tsconfig.lib.json), [`tsconfig.spec.json`](tsconfig.spec.json), and [`tsconfig.node.json`](tsconfig.node.json)), so only the tests see the Vitest globals that [`vitest.config.ts`](vitest.config.ts) turns on.

Check the types, and lint the sources with the `typescript` preset of [`@dnd-mapp/config-eslint`](../config-eslint/README.md):

```bash
pnpm moon run common:typecheck
```

```bash
pnpm moon run common:lint
```
