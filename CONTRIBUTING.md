# Contributing to D&D Mapp

Thanks for helping build D&D Mapp. This guide covers where a contribution starts, how issues move across the project board, and how to use AI tools. It then sets the conventions for branches, commits, and changelog entries, and explains how to check your changes and how a pull request gets reviewed and merged.

## Where to start

[`SUPPORT.md`](SUPPORT.md) lists where questions, ideas, bug reports, and other requests go. A code or docs change starts from an issue that a maintainer has triaged, and for now only maintainers make these changes, as [`GOVERNANCE.md`](GOVERNANCE.md#contributors) explains.

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

[Development](docs/development.md) sets up your machine and the repository. `pnpm install` also installs the [git hooks](docs/development.md#git-hooks), which catch formatting, Markdown, and commit message problems before CI runs.

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

## Projects

[Architecture](docs/architecture.md) describes the kinds of projects, the dependency rules between them, and how moon defines their tasks. Follow its [checklist](docs/architecture.md#adding-a-project) when you add a project.

## Checking your changes

Run the checks that the CI job runs for the changes on your branch:

```bash
pnpm moon ci :build-storybook :format-check :lint :lint-changelog :lint-md :lint-short-description :test-ci :typecheck --base origin/main
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
