# Release CLI

The `release` CLI bumps, verifies, and lints the `CHANGELOG.md` of a project in [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format, and the version in its `package.json`. The release workflows run it and name the project by its moon id. Node.js runs it from source through type stripping, and [`moon.yml`](moon.yml) defines the tasks below.

## Commands

The root `package.json` depends on the package, so run the CLI from the repository root:

```bash
pnpm exec release <command>
```

| Command                                               | Does                                                                                                                                                         |
|:------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `bump <project> <level> [--timezone <zone>] [--json]` | Moves the `Unreleased` entries into a release of the next version, dated today in `zone`, updates the compare links, and sets the version in `package.json`. |
| `verify <project>`                                    | Fails when `Unreleased` has no entries.                                                                                                                      |
| `verify <project> <version>`                          | Fails unless `package.json` and the newest release in the changelog hold `version`.                                                                          |
| `notes <project> <version> <file>`                    | Writes the section of `version` to `file`, without its heading.                                                                                              |
| `lint <project>`                                      | Prints each place where the changelog breaks Keep a Changelog, and fails when it finds any.                                                                  |

`level` is `auto`, `major`, `minor`, or `patch`. `auto` picks major for a `Removed` entry or one that starts with `**Breaking:**`, minor for an `Added`, `Changed`, or `Deprecated` entry, and patch for any other. Below `1.0.0`, it picks minor instead of major. `bump` prints the new version and how it chose the level, or `{ "version", "level", "reason" }` with `--json`. It refuses a version that isn't above the highest `<project>@v*` tag, which is the only step that reads git.

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

Both test tasks collect coverage into `coverage/` and fail when statements, branches, functions, or lines drop below 80%. The tests of the commands run against projects in temporary folders, with fakes for moon, git, and the clock. The tests in [`src/adapters`](src/adapters) run the real moon and git.

Check the types, and lint the sources with the `typescript` preset of [`@dnd-mapp/config-eslint`](../config-eslint/README.md):

```bash
pnpm moon run release:typecheck
```

```bash
pnpm moon run release:lint
```
