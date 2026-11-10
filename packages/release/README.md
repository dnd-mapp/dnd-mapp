# Release CLI

The `release` CLI bumps, verifies, and lints the `CHANGELOG.md` of a project in [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format, and the version in its `package.json`. It works in any repository: a pnpm, npm, or Yarn workspace, or a repository with one package. Node.js runs it from source through type stripping, and [`moon.yml`](moon.yml) defines the tasks below.

## Commands

Run the CLI in the folder of the package to release. The root `package.json` depends on the package, and `pnpm exec` finds it from any folder of the workspace:

```bash
cd apps/web
pnpm exec release <command>
```

Each command acts on the `package.json` and `CHANGELOG.md` in the working directory, and takes no project argument. Messages name these files by their path from the root of the git repository: the nearest folder at or above the working directory that holds `.git`.

| Command                                     | Does                                                                                                                                                         |
|:--------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `bump <level> [--timezone <zone>] [--json]` | Moves the `Unreleased` entries into a release of the next version, dated today in `zone`, updates the compare links, and sets the version in `package.json`. |
| `verify`                                    | Fails when `Unreleased` has no entries.                                                                                                                      |
| `verify <version>`                          | Fails unless `package.json` and the newest release in the changelog hold `version`.                                                                          |
| `notes <version> <file>`                    | Writes the section of `version` to `file`, without its heading.                                                                                              |
| `lint`                                      | Prints each place where the changelog breaks Keep a Changelog, and fails when it finds any.                                                                  |

`level` is `auto`, `major`, `minor`, or `patch`. `auto` picks major for a `Removed` entry or one that starts with `**Breaking:**`, minor for an `Added`, `Changed`, or `Deprecated` entry, and patch for any other. Below `1.0.0`, it picks minor instead of major. `bump` prints the new version and how it chose the level, or `{ "version", "level", "reason" }` with `--json`. It refuses a version that isn't above the highest tag of the project, which is the only step that reads git.

A package at the root of the git repository tags its releases `v<version>`. A package below the root tags them `<name>@v<version>`, with the `name` in its `package.json` without the scope, such as `web@v1.2.0` for `@dnd-mapp/web`. Two packages whose names differ only in the scope would share their tags, so give each package a name of its own. The compare links of the changelog point at these tags, in the repository that the `repository` field of the project's `package.json` names. That field takes a URL or the `github:` shorthand, and the links follow the URLs of GitHub. Each command fails when the field is missing.

Issue [#91](https://github.com/dnd-mapp/dnd-mapp/issues/91) holds the full rules of each command. On top of those, `lint` accepts a release heading that ends in `[YANKED]`, and fails on a category without entries.

Each project with a `CHANGELOG.md` inherits the `lint-changelog` task of [`.moon/tasks/changelog.yml`](../../.moon/tasks/changelog.yml), which runs `release lint` in CI whenever the changelog or the CLI changes. moon accepts task inputs from direct dependencies only, so such a project lists `@dnd-mapp/release` in its `devDependencies`, as [`apps/web/package.json`](../../apps/web/package.json) does.

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
pnpm moon run release:test
```

Run the unit tests once, as CI does. On GitHub Actions, the `github-actions` reporter annotates the pull request with each failing test:

```bash
pnpm moon run release:test-ci
```

Both test tasks collect coverage into `coverage/` and fail when statements, branches, functions, or lines drop below 80%. The tests of the commands run against projects in the file system mock of [`@dnd-mapp/testing`](../testing/README.md), with fakes for git and the clock. The tests in [`src/adapters`](src/adapters) run the git mock of the same package.

The `typecheck` task checks the sources, the tests, and the config files each with its own tsconfig ([`tsconfig.lib.json`](tsconfig.lib.json), [`tsconfig.spec.json`](tsconfig.spec.json), and [`tsconfig.node.json`](tsconfig.node.json)), so only the tests see the Vitest globals that [`vitest.config.ts`](vitest.config.ts) turns on.

Check the types, and lint the sources with the `typescript` preset and the `tsdoc` config of [`@dnd-mapp/config-eslint`](../config-eslint/README.md), which requires a doc comment on every interface, type alias, and member of either:

```bash
pnpm moon run release:typecheck
```

```bash
pnpm moon run release:lint
```
