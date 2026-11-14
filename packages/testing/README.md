# Test helpers

Helpers for the tests of any project of D&D Mapp. [`moon.yml`](moon.yml) defines the tasks below.

## Using the package

Add the package to the `devDependencies` of a project, next to `vitest`, which it expects as a peer. Add the `sources` group of the `testing` project to the inputs of each task that runs or checks the tests, as [Architecture](../../docs/architecture.md#modules-compile-from-source) describes.

## File system

`@dnd-mapp/testing/file-system` mocks `node:fs` and `node:fs/promises` with one set of files in memory, so a test never touches the disk. Load it through `vi.hoisted` in the test file, then call `mockFileSystem` with the content of each file by its path:

```ts
import { expect, it, vi } from 'vitest';
import { readManifest } from './manifest.ts';

const { mockFileSystem } = await vi.hoisted(() => import('@dnd-mapp/testing/file-system'));

it('reads the version', async () => {
    mockFileSystem({ '/repo/package.json': '{ "version": "1.0.0" }' });

    expect(await readManifest('/repo')).toEqual({ version: '1.0.0' });
});
```

Loading the module registers the mocks. `vi.hoisted` loads it before the test file imports anything, so the code under test gets the mocks too. A static import of the module registers them only for the modules that the test file imports after it.

Each call to `mockFileSystem` replaces all files, and creates the folders that hold them. The files stay in place for the next test of the file until the next call, so call it in each test or in `beforeEach`. A path resolves against the working directory with `node:path`, as `node:fs` resolves it, so `/repo/package.json` is `D:\repo\package.json` on Windows when the working directory is on drive `D:`. Names are case-sensitive on every OS.

The mock supports these functions, both in `node:fs` with the `Sync` suffix and in `node:fs/promises` without it: `readFile`, `writeFile`, `appendFile`, `mkdir`, `readdir`, `stat`, `lstat`, `access`, `rm`, and `unlink`. `node:fs` also has `existsSync` and `promises`. A call to any other function fails with an error from Vitest, rather than reaching the disk. Add the function to [`src/file-system/node-fs.ts`](src/file-system/node-fs.ts) when a test needs it.

Each function fails with the error that Node.js throws on Linux, with the same `code`, `syscall`, `path`, and message, such as `ENOENT` for a missing file. A test therefore fails the same way on every OS. Two errors differ from the ones Node.js throws on Windows: a path below a file fails with `ENOTDIR` rather than `ENOENT`, and `unlink` on a folder fails with `EISDIR` rather than `EPERM`.

## Git

`@dnd-mapp/testing/git` mocks `execFile` of `node:child_process` with a git repository in memory, so a test needs neither git nor a repository on the disk. Load it through `vi.hoisted`, as the [file system mock](#file-system), then call `mockGit` with the state of the repository:

```ts
import { expect, it, vi } from 'vitest';
import { listGitTags } from './git.ts';

const { mockGit } = await vi.hoisted(() => import('@dnd-mapp/testing/git'));

it('lists the version tags of a project', async () => {
    mockGit({ tags: ['web@v1.0.0', 'api@v1.0.0'] });

    expect(await listGitTags('web', '/repo')).toEqual(['web@v1.0.0']);
});
```

Each call to `mockGit` replaces the state, which stays in place for the next test of the file until the next call. The mock has one repository, so it ignores the options of `execFile`, such as `cwd`. It answers both through a callback and through `promisify`, which resolves to `{ stdout, stderr }` as for the real `execFile`.

The mock runs `git tag --list`, with any number of patterns, and prints the matching tags sorted by name, one per line, as git does. A pattern takes `*` for any text, `/` included, and `?` for one character. The mock fails for any other command, any other program, and any other syntax of a pattern, such as `[0-9]`, rather than answer differently from git. Add a command to [`src/git/repository.ts`](src/git/repository.ts) when a test needs it. The tests of the mock compare its output with that of the real git, in a temporary repository.

## Pointer

[`src/pointer/index.ts`](src/pointer/index.ts) is a setup file for the browser tests of an Angular project. Before each test, it moves the pointer to the bottom-right corner of the viewport, where no test renders a component. Without it, the pointer stays where the previous test left it, and Chrome hovers a component that the next test renders in that spot a frame later, so a test that expects the default look fails in some orders.

Load it through the `setupFiles` option of the `test` target in `angular.json`, by its path from the project, as [`packages/ui/web/angular.json`](../ui/web/angular.json) does, so the Angular unit-test builder compiles it with the tests:

```json
"setupFiles": ["../../testing/src/pointer/index.ts"]
```

The setup file moves the pointer before the test renders anything. A test that hovers a component and then checks the default look still moves the pointer away itself.

## Tasks

Run each task from the repository root.

| Task        | Command                                                                                                                                          | Runs in CI | Cached |
|:------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|:----------:|:------:|
| `test`      | `vitest`                                                                                                                                         |     no     |   no   |
| `test-ci`   | `vitest run --reporter dot --reporter github-actions`                                                                                            |    yes     |  yes   |
| `typecheck` | `tsc --project tsconfig.lib.json && tsc --project tsconfig.browser.json && tsc --project tsconfig.spec.json && tsc --project tsconfig.node.json` |    yes     |  yes   |
| `lint`      | `eslint . --max-warnings 0`                                                                                                                      |    yes     |  yes   |

Run the unit tests with [Vitest](https://vitest.dev), and rerun them when a file changes:

```bash
pnpm moon run testing:test
```

Run the unit tests once, as CI does:

```bash
pnpm moon run testing:test-ci
```

Both test tasks collect coverage into `coverage/` and fail when statements, branches, functions, or lines drop below 80%.

The `typecheck` task checks the sources, the tests, and the config files each with its own tsconfig, as [Architecture](../../docs/architecture.md#typescript-configs) describes. The pointer setup file runs in the browser, so `tsconfig.browser.json` checks it with the DOM types, which the other sources leave out.

Check the types, and lint the sources with the `typescript` preset of [`@dnd-mapp/config-eslint`](../config-eslint/README.md):

```bash
pnpm moon run testing:typecheck
```

```bash
pnpm moon run testing:lint
```
