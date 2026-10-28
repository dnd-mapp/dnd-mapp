# Contributing to D&D Mapp

Thanks for helping build D&D Mapp. This guide covers where a contribution starts, the conventions for branches, commits, projects, and tasks, how to check your changes, and how a pull request gets reviewed and merged.

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

## Projects, tasks, and dependencies

Give every new project a `project` block in its `moon.yml`, with a title, a description, the owner, and the maintainers, as the existing projects do. `pnpm moon project <id>` and the moon VS Code extension show it, so contributors can see what a project is for and who to ask without opening its code.

Put each module of an app in `packages/<domain>/<slot>`, and name it `@dnd-mapp/<domain>-<slot>`, with a moon `id` that repeats the name without the scope. The slot is the platform the module runs on, such as `web`, or `domain` for the plain TypeScript that every platform of the domain shares, such as models, validation, and rules. The `core` domain holds the shell of each app that its domain modules build on, as [`packages/core/web`](packages/core/web/README.md) does for the web client. Set the `id` in `moon.yml` explicitly, since moon names a project after its folder and every app module of a platform shares the folder name of its slot. Packages for the whole workspace, such as tooling and configs, stay flat in `packages/<name>`.

Point the `exports` of a module's `package.json` at its TypeScript sources, so the app compiles the module in its own build and the module needs no build of its own. The Angular compiler skips the files that TypeScript resolves through `node_modules`, so an Angular app maps each module it imports to its sources with a `paths` entry in its `tsconfig.json`. moon hashes the inputs of a project's own tasks only, so add each module to the inputs of the app tasks that build it, as a project input with the module's `sources` group:

```yaml
inputs:
    - project: "core-web"
      group: "sources"
```

A module may depend on the `core` of its platform, on the `domain` package of its own domain, and on the `domain` package of `core`. A `domain` package may depend on other `domain` packages only. Domain modules never depend on the platform packages of another domain: they meet through the router of `core`, which lazy-loads them, or through `domain` packages.

Extend a preset of [`@dnd-mapp/config-typescript`](packages/config-typescript/README.md) from the `tsconfig.json` of a new TypeScript project, and add `@group(configs)` to the inputs of its tasks, as the package README explains. Without that group, a change to a preset reruns none of the project's tasks.

Name the inputs of a task through file groups rather than listing globs, so tasks that read the same files share one list and a new file reaches all of them. [`.moon/tasks/all.yml`](.moon/tasks/all.yml) defines the groups that every project inherits, such as `configs`, and a project defines its own groups, such as `sources`, under `fileGroups` in its `moon.yml`. A project group replaces an inherited group with the same name, and the globs of every group resolve from the root of the project that uses it.

Define a task that more than one project runs once, in a file in `.moon/tasks/`, rather than in each project's `moon.yml`. The `inheritedBy` conditions of each file pick the projects that inherit its tasks: [`.moon/tasks/eslint.yml`](.moon/tasks/eslint.yml) gives the `lint` task to every project with an `eslint.config.ts`. A project that inherits a task defines the file groups it reads, such as `sources`, and overrides or extends the task by defining one with the same id in its own `moon.yml`. To opt out, list the tasks under `workspace.inheritedTasks.exclude` in the project's `moon.yml`; the `root` project sets `include: []` to inherit none. `pnpm moon project <id>` lists every task of a project, inherited ones included.

Add each new catalog of development tools to the auto-merge rule in [`.github/renovate.json`](.github/renovate.json); the updates of any other catalog wait for review. The [Dependency updates](README.md#dependency-updates) section of the README explains which updates Renovate merges on its own.

## Checking your changes

Run the checks that the CI job runs for the changes on your branch:

```bash
pnpm moon ci :format-check :lint :lint-md :test-ci :typecheck --base origin/main
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

- The required checks pass: `CI`, `Pull request title`, `Web build`, and `Web image`. The web jobs skip when the change does not affect the web app, which counts as passing.
- A member of [@dnd-mapp/reviewers](https://github.com/orgs/dnd-mapp/teams/reviewers), the code owners in [`CODEOWNERS`](.github/CODEOWNERS), approves it.
- Someone other than you approves your last push. A new push dismisses earlier approvals, so the reviewer sees the final state.

Reviewers leave comments in threads; answer each one with the commit that addresses it, or with the reason you disagree. Since the merge commit keeps every commit of the branch, clean up the history before you ask for review, and squash fixups into the commit they fix.

Once approved, the pull request merges with a merge commit. Squash and rebase merges are turned off.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE) of the project.
