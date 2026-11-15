# Release CLI

The `release` CLI bumps, verifies, and lints the `CHANGELOG.md` of a project in [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format, sets the version in its `package.json`, and writes the notes of a release. It works in any repository: a pnpm, npm, or Yarn workspace, or a repository with one package. Node.js runs it from source through type stripping, and [`eslint.config.ts`](eslint.config.ts) applies the `typescript` preset and the `tsdoc` config of [`@dnd-mapp/config-eslint`](../config-eslint/README.md).

[Releasing](../../docs/releasing.md) walks a maintainer through a release. The [`Release pull request`](../../.github/workflows/release-pull-request.yaml) workflow runs `verify` and `bump`, the [`Release`](../../.github/workflows/release.yaml) workflow runs `verify <version>` and `notes`, and the `lint-changelog` task runs `lint` in CI.

## Using the package

Each project with a `CHANGELOG.md` inherits the `lint-changelog` task of [`.moon/tasks/changelog.yml`](../../.moon/tasks/changelog.yml), which runs `release lint` in CI whenever the changelog or the CLI changes. moon accepts task inputs from direct dependencies only, so such a project lists `@dnd-mapp/release` in its `devDependencies`, as [`apps/web/package.json`](../../apps/web/package.json) does.

Run the CLI in the folder of the package to release. The root `package.json` depends on the package, and `pnpm exec` finds it from any folder of the workspace:

```bash
cd apps/web
pnpm exec release <command>
```

Each command acts on the `package.json` and `CHANGELOG.md` in the working directory, and takes no project argument. Messages name these files by their path from the root of the git repository: the nearest folder at or above the working directory that holds `.git`.

## Commands

| Command                                     | Does                                                                                                                                                         |
|:--------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `bump <level> [--timezone <zone>] [--json]` | Moves the `Unreleased` entries into a release of the next version, dated today in `zone`, updates the compare links, and sets the version in `package.json`. |
| `verify`                                    | Fails when `Unreleased` has no entries.                                                                                                                      |
| `verify <version>`                          | Fails unless `package.json` and the newest release in the changelog hold `version`.                                                                          |
| `notes <version> <file>`                    | Writes the section of `version` to `file`, without its heading and the link reference definitions.                                                           |
| `lint`                                      | Prints each place where the changelog breaks Keep a Changelog, and fails when it finds any.                                                                  |

`level` is `auto`, `major`, `minor`, or `patch`. `auto` picks major for a `Removed` entry or one that starts with `**Breaking:**`, minor for an `Added`, `Changed`, or `Deprecated` entry, and patch for any other. Below `1.0.0`, it picks minor instead of major. `bump` prints the new version and how it chose the level.

Only `bump` takes options, and every other command fails on them:

| Option              | Default                       | Takes                                                                                                   |
|:--------------------|:------------------------------|:--------------------------------------------------------------------------------------------------------|
| `--timezone <zone>` | The time zone of the machine. | The IANA time zone of the release date, such as `Europe/Amsterdam`. An offset, such as `+05:00`, fails. |
| `--json`            | Off.                          | Prints `{ "version", "level", "reason" }` instead of a line of text, for the workflow to read.          |

The `Release pull request` workflow passes its `timezone` input, which defaults to `Europe/Amsterdam`, so a release from the workflow and one from your machine can get different dates.

### What `bump` checks

`bump` checks the following in this order, and writes nothing until each check passes:

1. `level` is `auto`, `major`, `minor`, or `patch`.
2. `zone` is an IANA time zone.
3. The changelog passes [`lint`](#what-lint-reports).
4. `Unreleased` has entries.
5. `package.json` holds the version of the newest release in the changelog, or `0.0.0` when the changelog has no release yet.
6. The new version is above the highest [tag](#tags-and-compare-links) of the project. This is the only check that reads git.

It then writes the changelog and `package.json`, and keeps the line endings and indentation of each.

### What `lint` reports

`lint` prints each problem as `<changelog>:<line>: <message>`, in the order of the lines. It reads each `##` heading as a section, each `###` heading as a category, each line that starts with `-`, `*`, or `+` and a space as an entry, and each `[<label>]: <url>` line as a link reference definition. It reports:

- **The `Unreleased` section:** a changelog without `## [Unreleased]`, an `Unreleased` section below another section, and a second `Unreleased` section.
- **Release headings:** a `##` heading other than `## [Unreleased]` or `## [<major>.<minor>.<patch>] - <YYYY-MM-DD>`, which may end in `[YANKED]`, and a date that isn't an existing day.
- **Release versions:** a version that a release above already has, and one that isn't below the version of the release above it.
- **Entries:** a release without entries, and a category without entries.
- **Categories:** a category other than `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, and `Security`.
- **Link reference definitions:** a second definition of the same label in any case, a label that no heading needs, a URL other than the one the heading needs, and a heading whose definition is missing.

`lint` accepts an empty `Unreleased` section, which `verify` reports instead, and entries above the first category of a section.

## Tags and compare links

A package at the root of the git repository tags its releases `v<version>`. A package below the root tags them `<name>@v<version>`, with the `name` in its `package.json` without the scope, such as `web@v1.2.0` for `@dnd-mapp/web`. Two packages whose names differ only in the scope would share their tags, so give each package a name of its own.

The compare links of the changelog point at these tags, in the repository that the `repository` field of the project's `package.json` names. That field takes a URL or the `github:` shorthand, and the links follow the URLs of GitHub. Each command fails when the field is missing, or when a package below the root has no `name`.

A changelog with releases needs one link reference definition per heading: `unreleased` compares the newest release to `HEAD`, each release compares the release below it to itself, and the oldest release links to its tag. A changelog without releases needs none. `bump` rewrites the definitions where the first one stood, or appends them to the end of the changelog:

```markdown
[unreleased]: https://github.com/dnd-mapp/dnd-mapp/compare/web@v0.2.0...HEAD
[0.2.0]: https://github.com/dnd-mapp/dnd-mapp/compare/web@v0.1.0...web@v0.2.0
[0.1.0]: https://github.com/dnd-mapp/dnd-mapp/releases/tag/web@v0.1.0
```

## Testing

The tests of the commands run against projects in the file system mock of [`@dnd-mapp/testing`](../testing/README.md), with fakes for git and the clock. The tests in [`src/adapters`](src/adapters) run the git mock of the same package. Both test tasks collect coverage into `coverage/` and fail when statements, branches, functions, or lines drop below 80%.

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
pnpm moon run release:test
```

Run the unit tests once, as CI does. On GitHub Actions, the `github-actions` reporter annotates the pull request with each failing test:

```bash
pnpm moon run release:test-ci
```

Check the types of the sources, the tests, and the config files, each with its own tsconfig, as [Architecture](../../docs/architecture.md#typescript-configs) describes:

```bash
pnpm moon run release:typecheck
```

Lint the sources. The `tsdoc` config requires a doc comment on every interface, type alias, and member of either:

```bash
pnpm moon run release:lint
```
