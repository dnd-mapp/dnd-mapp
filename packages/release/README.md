# Release CLI

The `release` CLI bumps, verifies, and lints the `CHANGELOG.md` of a project in [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format, and the version in its `package.json`. It works in any repository: a pnpm, npm, or Yarn workspace, or a repository with one package. Node.js runs it from source through type stripping, and [`moon.yml`](moon.yml) defines the tasks below.

## Commands

The root `package.json` depends on the package, so run the CLI from the repository root:

```bash
pnpm exec release <command>
```

In a workspace, `<project>` names a package by the `name` in its `package.json` without the scope, such as `web` for `@dnd-mapp/web`. The CLI finds the packages through the `packages` globs of `pnpm-workspace.yaml`, or else the `workspaces` globs of the root `package.json`, and fails when two of them share a name. In a repository with one package, the project is the package at the root, and every command leaves out `<project>`.

| Command                                               | Does                                                                                                                                                         |
|:------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `bump <project> <level> [--timezone <zone>] [--json]` | Moves the `Unreleased` entries into a release of the next version, dated today in `zone`, updates the compare links, and sets the version in `package.json`. |
| `verify <project>`                                    | Fails when `Unreleased` has no entries.                                                                                                                      |
| `verify <project> <version>`                          | Fails unless `package.json` and the newest release in the changelog hold `version`.                                                                          |
| `notes <project> <version> <file>`                    | Writes the section of `version` to `file`, without its heading.                                                                                              |
| `lint <project>`                                      | Prints each place where the changelog breaks Keep a Changelog, and fails when it finds any.                                                                  |

`level` is `auto`, `major`, `minor`, or `patch`. `auto` picks major for a `Removed` entry or one that starts with `**Breaking:**`, minor for an `Added`, `Changed`, or `Deprecated` entry, and patch for any other. Below `1.0.0`, it picks minor instead of major. `bump` prints the new version and how it chose the level, or `{ "version", "level", "reason" }` with `--json`. It refuses a version that isn't above the highest tag of the project, which is the only step that reads git.

A release has the tag `<project>@v<version>` in a workspace, and `v<version>` in a repository with one package. The compare links of the changelog point at these tags, in the repository that the `repository` field of the project's `package.json` names. That field takes a URL or the `github:` shorthand, and the links follow the URLs of GitHub. Each command fails when the field is missing.

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

Both test tasks collect coverage into `coverage/` and fail when statements, branches, functions, or lines drop below 80%. The tests of the commands run against projects in the file system mock of [`@dnd-mapp/testing`](../testing/README.md), with fakes for git and the clock. The tests in [`src/adapters`](src/adapters) run the git mock of the same package.

Check the types, and lint the sources with the `typescript` preset and the `tsdoc` config of [`@dnd-mapp/config-eslint`](../config-eslint/README.md), which requires a doc comment on every interface, type alias, and member of either:

```bash
pnpm moon run release:typecheck
```

```bash
pnpm moon run release:lint
```
