# Release CLI

The `release` CLI lints the `CHANGELOG.md` of a project in [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format. The release workflows run it and name the project by its moon id. Node.js runs it from source through type stripping, and [`moon.yml`](moon.yml) defines the tasks below.

## Commands

The root `package.json` depends on the package, so run the CLI from the repository root:

```bash
pnpm exec release <command>
```

| Command          | Does                                                                                        |
|:-----------------|:--------------------------------------------------------------------------------------------|
| `lint <project>` | Prints each place where the changelog breaks Keep a Changelog, and fails when it finds any. |

Issue [#91](https://github.com/dnd-mapp/dnd-mapp/issues/91) holds the full rules of each command. On top of those, `lint` accepts a release heading that ends in `[YANKED]`, and fails on a category without entries.

## Tasks

Run each task from the repository root.

| Task        | Command                                               | Runs in CI | Cached |
|:------------|:------------------------------------------------------|:----------:|:------:|
| `test`      | `vitest`                                              |     no     |   no   |
| `test-ci`   | `vitest run --reporter dot --reporter github-actions` |    yes     |  yes   |
| `typecheck` | `tsc`                                                 |    yes     |  yes   |
| `lint`      | `eslint . --max-warnings 0`                           |    yes     |  yes   |

Run the unit tests with [Vitest](https://vitest.dev), and rerun them when a file changes:

```bash
pnpm moon run release:test
```

Run the unit tests once, as CI does. On GitHub Actions, the `github-actions` reporter annotates the pull request with each failing test:

```bash
pnpm moon run release:test-ci
```

Both test tasks collect coverage into `coverage/` and fail when statements, branches, functions, or lines drop below 80%. The tests of the commands run against projects in temporary folders, with a fake for moon. The tests in [`src/adapters`](src/adapters) run the real moon.

Check the types, and lint the sources with the `typescript` preset of [`@dnd-mapp/config-eslint`](../config-eslint/README.md):

```bash
pnpm moon run release:typecheck
```

```bash
pnpm moon run release:lint
```
