# Contributing to D&D Mapp

Thanks for helping build D&D Mapp. This guide covers where a contribution starts, how issues move across the project board, how to use AI tools, the conventions for branches, commits, changelog entries, projects, and tasks, how to check your changes, and how a pull request gets reviewed and merged.

## Where to start

| Contribution          | Where it starts                                                                                                                                  |
|:----------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| An idea               | A discussion in [Ideas](https://github.com/dnd-mapp/dnd-mapp/discussions/categories/ideas). Solid ideas become issues.                           |
| A question            | A discussion in [Q&A](https://github.com/dnd-mapp/dnd-mapp/discussions/categories/q-a).                                                          |
| A bug                 | The [Bug form](https://github.com/dnd-mapp/dnd-mapp/issues/new?template=1-bug.yml).                                                              |
| A security issue      | A private [security advisory](https://github.com/dnd-mapp/dnd-mapp/security/advisories/new), never a public issue.                               |
| A code or docs change | An issue that a maintainer has triaged. For now, only maintainers make these changes, as [`GOVERNANCE.md`](GOVERNANCE.md#contributors) explains. |

A [maintainer](GOVERNANCE.md#maintainers) triages an issue by setting its status to Ready on the [D&D Mapp project](https://github.com/orgs/dnd-mapp/projects/10), and assigns it to whoever picks it up, so no one else starts on it. The other issue forms are for maintainers, who file the work that comes out of discussions and bug reports.

## Project board

The [D&D Mapp project](https://github.com/orgs/dnd-mapp/projects/10) has two boards: one for epics, and one for the work items that epics break into, such as tasks, features, research, and bugs. Triage and Backlog have no limit. Each status from Ready onward has a WIP limit, and only an expedited bug may move into a full status:

- **Expedited bugs.** A bug that cannot wait for a free slot, such as one that breaks the deployed app, may go over the WIP limit of each status it moves through. A maintainer decides when a bug qualifies, and only one issue is expedited at a time. It goes ahead of all other work, and its pull request gets reviewed first.
- **Epic status.** An epic moves to In progress when its first sub-issue does, and to Done when its last sub-issue does. Epics skip In review, since review happens on the pull requests of their sub-issues.
- **Blocked epics.** When the epic in progress gets blocked, the next Ready epic moves to In progress, and the blocked epic goes back to Ready until its blocker clears.

## Using AI tools

AI tools are welcome on the terms that [`GOVERNANCE.md`](GOVERNANCE.md#roles) sets for everyone in every role, maintainers included. This section spells out what those terms ask of each kind of contribution.

Before you post, check that your contribution meets the bar for its kind:

| Contribution              | Before you post                                                                                                                                                  |
|:--------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A discussion              | It says what you mean, in your own words, without padding.                                                                                                       |
| A bug report              | You reproduced the bug on the version you name, and the steps, environment, and logs are ones you observed.                                                      |
| A security advisory       | You confirmed the weakness in D&D Mapp's code, not only in the output of a scanner or an AI tool.                                                                |
| A pull request            | You can explain every line it changes and why, you ran the checks under [Checking your changes](#checking-your-changes), and its description matches the change. |
| A review comment or reply | You read the code it is about, and checked any finding an AI tool suggested.                                                                                     |

An agent posts nothing on your behalf until you have read and approved it. The project's own bots fall under [Automation](GOVERNANCE.md#automation) instead.

You do not need to say that you used AI tools, but answer honestly when a maintainer asks.

A maintainer closes a contribution that falls short of this bar. Clearly unchecked work closes right away. When it is unclear, the maintainer asks questions once, and closes the contribution if the answers fall short or 14 days pass without one. Using an AI tool is never by itself a reason to close a contribution. A closed contribution can come back once it meets the bar, but posting unchecked work again after a close violates the [code of conduct](CODE_OF_CONDUCT.md#other-restrictions).

## Setting up

The [Development](README.md#development) section of the README sets up the repository and runs its tasks.

`pnpm install` also installs git hooks with [lefthook](https://lefthook.dev), so formatting, Markdown, and commit message problems surface before CI runs. [`lefthook.yaml`](lefthook.yaml) defines them:

- `pre-commit` formats the staged files with Prettier and fixes the staged Markdown files with markdownlint, then adds the fixes to the commit. The commit stops when markdownlint finds a problem it cannot fix.
- `commit-msg` lints the commit message with commitlint.

Set `LEFTHOOK=0` to skip the hooks for one command:

```bash
LEFTHOOK=0 git commit
```

## Branches

Branch from `main`, and name the branch `<type>/<slug>`: the [commit type](#commits) of its main change, then a few lowercase words joined by hyphens, such as `docs/add-contributing-guide`. Leave the issue number out; the `Closes` or `Refs:` line of the pull request links the issue.

## Commits

Write each commit message as a [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/). [`.commitlintrc.json`](.commitlintrc.json) holds the rules, on top of [`@commitlint/config-conventional`](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional):

- Pick the type from `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, and `test`.
- Keep the header at or under 72 characters, and wrap the body at 72 columns. Footer lines may run longer.
- Start the subject in lowercase, as in `fix: keep the grid aligned on zoom`.
- Mark a breaking change with `!` after the type, as in `feat!: drop the v1 map format`, and say what breaks and how to migrate in a `BREAKING CHANGE:` footer.
- End the message with `Closes #<number>` when the commit resolves an issue, or `Refs: #<number>` when it only relates to one.

The `commit-msg` hook lints each message as you commit, and CI lints every commit of the pull request again. Lint the commit messages of your branch with [commitlint](https://commitlint.js.org) yourself:

```bash
pnpm exec commitlint --from origin/main
```

Sign every commit. The `main` branch rejects unsigned commits, and the pull request merges with a merge commit that keeps your commits as they are, so a single unsigned commit blocks the merge. GitHub explains how to [sign commits](https://docs.github.com/authentication/managing-commit-signature-verification/signing-commits) with a GPG or SSH key, and how to [add the key to your account](https://docs.github.com/authentication/managing-commit-signature-verification/adding-a-gpg-key-to-your-github-account) so GitHub marks the commits as verified.

## Changelog

Each releasable project keeps a `CHANGELOG.md` in [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format next to its `package.json`, as [`apps/web`](apps/web/CHANGELOG.md) does. Its entries decide the next version and become the notes of the GitHub Release, so add them under `## [Unreleased]` in the pull request that makes the change. [`docs/releasing.md`](docs/releasing.md) covers how a maintainer turns them into a release.

### Which changes get an entry

Add an entry for each change that users of the project notice: something they can now do, something that behaves differently, a bug they could hit, or a change to how they deploy it, such as a build argument of its image. A change to a module goes in the changelog of each app that builds it, since the app is what users get. Refactors, tests, CI, tooling, contributor docs, and dependency updates that change nothing users see get no entry.

Write each entry as one list item that says what changed for users, not how the code changed. CI lints every changelog with `release lint`; run the same check yourself with `pnpm moon run :lint-changelog`.

### Categories

File each entry under the category that fits it. When a maintainer releases with the default level `auto`, the categories in `Unreleased` pick the version bump, and the highest bump wins:

| Category         | For                                       | `auto` bumps |
|:-----------------|:------------------------------------------|:------------:|
| `### Added`      | New features.                             |    minor     |
| `### Changed`    | Changes to existing behavior.             |    minor     |
| `### Deprecated` | Features that a later release removes.    |    minor     |
| `### Removed`    | Features that this release removes.       |    major     |
| `### Fixed`      | Bug fixes.                                |    patch     |
| `### Security`   | Fixes of vulnerabilities.                 |    patch     |

Add a category heading together with its first entry, since the lint fails on a category without entries.

### Breaking changes

Start an entry with `**Breaking:**` when the change breaks something users rely on, whatever its category, and say how to migrate:

```markdown
### Changed

- **Breaking:** The image serves the app on port 8080 instead of 4200. Map port 8080 in your deployment.
```

`auto` bumps the major version for a `**Breaking:**` entry, as it does for a `### Removed` one. Below `1.0.0`, it bumps the minor version instead, since major version 0 is for initial development. The `!` and `BREAKING CHANGE:` footer of a [commit](#commits) don't reach the version; only the changelog entry does.

## Projects, tasks, and dependencies

Give every new project a `project` block in its `moon.yml`, with a title, a description, the owner, and the maintainers, as the existing projects do. `pnpm moon project <id>` and the moon VS Code extension show it, so contributors can see what a project is for and who to ask without opening its code.

Put each module of an app in `packages/<domain>/<slot>`, and name it `@dnd-mapp/<domain>-<slot>`, with a moon `id` that repeats the name without the scope. The slot is the platform the module runs on, such as `web`, or `domain` for the plain TypeScript that every platform of the domain shares, such as models, validation, and rules. The `core` domain holds the shell of each app that its domain modules build on, as [`packages/core/web`](packages/core/web/README.md) does for the web client. Set the `id` in `moon.yml` explicitly, since moon names a project after its folder and every app module of a platform shares the folder name of its slot. Packages for the whole workspace, such as tooling and configs, stay flat in `packages/<name>`.

Point the `exports` of a module's `package.json` at its TypeScript sources, so the app compiles the module in its own build and the module needs no build of its own. The Angular compiler skips the files that TypeScript resolves through `node_modules`, so map each module to its sources with a `paths` entry in [`tsconfig.base.json`](tsconfig.base.json) at the root of the repository. The file holds nothing but `paths`, so a project of any platform lists it in `extends` next to its preset, as [`apps/web/tsconfig.json`](apps/web/tsconfig.json) does. Keep `paths` out of the `tsconfig.json` of a project, since it would replace the shared map rather than add to it. moon hashes the inputs of a project's own tasks only, so add each module to the inputs of the app tasks that build it, as a project input with the module's `sources` group:

```yaml
inputs:
    - project: "core-web"
      group: "sources"
```

An app depends on the `core` of its platform only. A module may depend on the `core` of its platform, on the `domain` package of its own domain, and on the `domain` package of `core`. A `domain` package may depend on other `domain` packages only. Domain modules never depend on the platform packages of another domain: they meet through the router of `core`, which lazy-loads them with `import()`, or through `domain` packages. Any project may also depend on the packages for the whole workspace, such as the helpers of [`@dnd-mapp/common`](packages/common/README.md).

Two checks enforce these rules. Tag each project in its `moon.yml` with the platform it runs on, such as `web` or `server`, with `domain` for a `domain` package, or with `tooling` for the root project and the packages of the whole workspace. Under `constraints.tagRelationships`, [`.moon/workspace.yml`](.moon/workspace.yml) lets a platform project depend on projects of its own platform, `domain`, and `tooling`, and a `domain` package on `domain` and `tooling` projects. moon fails to build its project graph on any other dependency, including one on a project without a tag, so every `moon` command reports it. Add a tag to `tagRelationships` along with the first project of a new platform.

moon reads dependencies from `package.json` only, while the path aliases let a project import any module. Extend a preset of [`@dnd-mapp/config-eslint`](packages/config-eslint/README.md) from the `eslint.config.ts` of each new project, as its README explains: `angular` for an Angular app or module, `playwright` for end-to-end tests, and `typescript` for any other TypeScript project. Every preset applies a rule that fails the `lint` task on an import that breaks the rules above, and on an import of a project that the project's `package.json` does not declare.

Extend a preset of [`@dnd-mapp/config-typescript`](packages/config-typescript/README.md) from the `tsconfig.json` of a new TypeScript project, and add `@group(configs)` to the inputs of its tasks, as the package README explains. Without that group, a change to a preset reruns none of the project's tasks.

Name the inputs of a task through file groups rather than listing globs, so tasks that read the same files share one list and a new file reaches all of them. [`.moon/tasks/all.yml`](.moon/tasks/all.yml) defines the groups that every project inherits, such as `configs`, and a project defines its own groups, such as `sources`, under `fileGroups` in its `moon.yml`. A project group replaces an inherited group with the same name, and the globs of every group resolve from the root of the project that uses it.

Define a task that more than one project runs once, in a file in `.moon/tasks/`, rather than in each project's `moon.yml`. The `inheritedBy` conditions of each file pick the projects that inherit its tasks: [`.moon/tasks/eslint.yml`](.moon/tasks/eslint.yml) gives the `lint` task to every project with an `eslint.config.ts`. A project that inherits a task defines the file groups it reads, such as `sources`, and overrides or extends the task by defining one with the same id in its own `moon.yml`. To opt out, list the tasks under `workspace.inheritedTasks.exclude` in the project's `moon.yml`; the `root` project sets `include: []` to inherit none. `pnpm moon project <id>` lists every task of a project, inherited ones included.

Add each new catalog of development tools to the auto-merge rule in [`.github/renovate.json`](.github/renovate.json); the updates of any other catalog wait for review. The [Dependency updates](README.md#dependency-updates) section of the README explains which updates Renovate merges on its own.

## Checking your changes

Run the checks that the CI job runs for the changes on your branch:

```bash
pnpm moon ci :format-check :lint :lint-changelog :lint-md :lint-short-description :test-ci :typecheck --base origin/main
```

Lint the GitHub Actions workflows with [actionlint](https://github.com/rhysd/actionlint), the same check CI runs. Install [ShellCheck](https://github.com/koalaman/shellcheck) next to it, since actionlint lints the `run:` scripts only when it finds ShellCheck on `PATH`:

```bash
actionlint
```

## Pull requests

Open the pull request against `main`, and keep it to one concern: an unrelated fix you find along the way gets a pull request of its own.

- Write the title as a Conventional Commit subject, under the same rules as a commit header. The `Pull request title` check lints it again after each edit.
- Fill in the [pull request template](.github/PULL_REQUEST_TEMPLATE.md). Its comments explain each section.
- End the description with a `Closes #<number>` line for the issue the pull request resolves, which moves the issue to In review on the project and closes it on merge.

## Review and merge

A pull request merges once all of these hold:

- The required checks pass: `CI`, `Pull request title`, `Web image`, and `End-to-end tests`. The `Web image` job skips when the change does not affect the web app, and the `End-to-end tests` job skips when the change affects neither the web app nor its tests. A skipped job counts as passing.
- A member of [@dnd-mapp/reviewers](https://github.com/orgs/dnd-mapp/teams/reviewers), the code owners in [`CODEOWNERS`](.github/CODEOWNERS), approves it. [`GOVERNANCE.md`](GOVERNANCE.md#roles) explains who belongs to the team.
- Someone other than you approves your last push. A new push dismisses earlier approvals, so the reviewer sees the final state.

Reviewers leave comments in threads; answer each one with the commit that addresses it, or with the reason you disagree. Since the merge commit keeps every commit of the branch, clean up the history before you ask for review, and squash fixups into the commit they fix.

Once approved, the pull request merges with a merge commit. Squash and rebase merges are turned off.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE) of the project.
