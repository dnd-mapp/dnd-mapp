# Common helpers

Small, general helpers that any project of D&D Mapp can use.

## What belongs here

A helper belongs here when it knows nothing about D&D Mapp, a domain, or a platform: no models or rules of a domain, and no Angular, DOM, or Node.js APIs. Code that the platforms of a domain share goes in the `domain` package of that domain, `packages/<domain>/domain`, as [Architecture](../../docs/architecture.md#projects) describes.

## Using the package

Add the package to the `dependencies` of a project. Each project compiles the helpers from their TypeScript sources in its own build, as [Architecture](../../docs/architecture.md#modules-compile-from-source) describes, so add the `sources` group of the `common` project to the inputs of each task that compiles them. Add it to the inputs of `lint` too, since its type-aware rules read the types of the helpers, as [`packages/release/moon.yml`](../release/moon.yml) does:

```yaml
inputs:
    - project: "common"
      group: "sources"
```

The sources import each other with the `.ts` extension, as Node.js requires, so the `node` and `angular` presets of [`@dnd-mapp/config-typescript`](../config-typescript/README.md) both allow it.

## Helpers

| Helper              | Does                                                                                                     |
|:--------------------|:---------------------------------------------------------------------------------------------------------|
| `tryCatch(promise)` | Awaits `promise`, and resolves to its value or to the reason it rejected with, never rejecting.          |
| `tryCatchSync(fn)`  | Calls `fn`, and returns its value or the error it threw, never throwing. Pass a promise to `tryCatch`.   |

Both return a `Result<T>`, which is either a `Success<T>`, `{ ok: true, value }`, or a `Failure`, `{ ok: false, error }`. The package exports all three types. Check `ok` to tell the two apart, since JavaScript can throw any value, `undefined` included. The `error` is `unknown` for the same reason. The helpers keep the variable `const` and the happy path flat where a `let` above a `try` block would otherwise take the value:

```ts
import { tryCatch } from '@dnd-mapp/common';

const read = await tryCatch(readFile(path, 'utf8'));

if (!read.ok) {
    throw new Error(`cannot read ${path}`, { cause: read.error });
}
const text = read.value;
```

## Tasks

[`moon.yml`](moon.yml) defines the tasks below, and the project inherits `lint` from [`.moon/tasks/eslint.yml`](../../.moon/tasks/eslint.yml). Run each task from the repository root.

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

The `typecheck` task checks the sources, the tests, and the config files each with its own tsconfig, as [Architecture](../../docs/architecture.md#typescript-configs) describes.

Check the types, and lint the sources with the `typescript` preset of [`@dnd-mapp/config-eslint`](../config-eslint/README.md):

```bash
pnpm moon run common:typecheck
```

```bash
pnpm moon run common:lint
```
