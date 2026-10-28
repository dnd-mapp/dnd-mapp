# Contributing to D&D Mapp

Thanks for helping build D&D Mapp. This guide covers where a contribution starts, the conventions the checks enforce, and how a pull request gets reviewed and merged.

## Where to start

| Contribution          | Where it starts                                                                                                        |
|:----------------------|:-----------------------------------------------------------------------------------------------------------------------|
| An idea               | A discussion in [Ideas](https://github.com/dnd-mapp/dnd-mapp/discussions/categories/ideas). Solid ideas become issues. |
| A question            | A discussion in [Q&A](https://github.com/dnd-mapp/dnd-mapp/discussions/categories/q-a).                                |
| A bug                 | The [Bug form](https://github.com/dnd-mapp/dnd-mapp/issues/new?template=1-bug.yml).                                    |
| A security issue      | A private [security advisory](https://github.com/dnd-mapp/dnd-mapp/security/advisories/new), never a public issue.     |
| A code or docs change | An issue that a maintainer has triaged.                                                                                |

A maintainer triages an issue by setting its status to Ready on the [D&D Mapp project](https://github.com/orgs/dnd-mapp/projects/10). Comment on the issue you want to work on before you start, so a maintainer can assign it to you and no one else picks it up. The other issue forms are for maintainers, who file the work that comes out of discussions and bug reports.

## Setting up

The [Development](README.md#development) section of the README sets up the repository and lists the checks CI runs. `pnpm install` also installs the [git hooks](README.md#git-hooks), which format your files and lint your commit messages before CI does.

## Branches

Branch from `main`, and name the branch `<type>/<slug>`: the [commit type](#commits) of its main change, then a few lowercase words joined by hyphens, such as `docs/add-contributing-guide`. Leave the issue number out; the `Closes` or `Refs:` line of the pull request links the issue.

## Commits

Write each commit message as a [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/). [`.commitlintrc.json`](.commitlintrc.json) holds the rules, on top of [`@commitlint/config-conventional`](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional):

- Pick the type from `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, and `test`.
- Keep the header at or under 72 characters, and wrap the body at 72 columns. Footer lines may run longer.
- Start the subject in lowercase, as in `fix: keep the grid aligned on zoom`.
- End the message with `Closes #<number>` when the commit resolves an issue, or `Refs: #<number>` when it only relates to one.

The `commit-msg` hook lints each message as you commit, and CI lints every commit of the pull request again.

Sign every commit. The `main` branch rejects unsigned commits, and the pull request merges with a merge commit that keeps your commits as they are, so a single unsigned commit blocks the merge. GitHub explains how to [sign commits](https://docs.github.com/authentication/managing-commit-signature-verification/signing-commits) with a GPG or SSH key, and how to [add the key to your account](https://docs.github.com/authentication/managing-commit-signature-verification/adding-a-gpg-key-to-your-github-account) so GitHub marks the commits as verified.

## Pull requests

Open the pull request against `main`, and keep it to one concern: an unrelated fix you find along the way gets a pull request of its own.

- Write the title as a Conventional Commit subject, under the same rules as a commit header. The `Pull request title` check lints it again after each edit.
- Fill in the [pull request template](.github/PULL_REQUEST_TEMPLATE.md). Its comments explain each section.
- End the description with a `Closes #<number>` line for the issue the pull request resolves, which moves the issue to In review on the project and closes it on merge.

## Review and merge

A pull request merges once all of these hold:

- The required checks pass: `CI`, `Pull request title`, `Web build`, and `Web image`. The web jobs skip when the change does not affect the web app, which counts as passing.
- A member of [@dnd-mapp/reviewers](https://github.com/orgs/dnd-mapp/teams/reviewers), the code owners in [`CODEOWNERS`](.github/CODEOWNERS), approves it.
- Someone other than you approves your last push. A new push dismisses earlier approvals, so the reviewer sees the final state.

Reviewers leave comments in threads; answer each one with the commit that addresses it, or with the reason you disagree. Since the merge commit keeps every commit of the branch, clean up the history before you ask for review, and squash fixups into the commit they fix.

Once approved, the pull request merges with a merge commit. Squash and rebase merges are turned off.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE) of the project.
