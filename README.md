# D&D Mapp

The monorepo for D&D Mapp: it holds all packages and applications of the project.

## Status

Early development: the repository holds no code yet.

## Development

Format the repository with Prettier:

```bash
pnpm format
```

Check the formatting without changing files:

```bash
pnpm format-check
```

Lint the Markdown files with [markdownlint](https://github.com/DavidAnson/markdownlint-cli2), the same check CI runs. [`.markdownlint-cli2.yaml`](.markdownlint-cli2.yaml) holds the rules:

```bash
pnpm lint-md
```

Lint the GitHub Actions workflows with [actionlint](https://github.com/rhysd/actionlint), the same check CI runs. Install [ShellCheck](https://github.com/koalaman/shellcheck) next to it, since actionlint lints the `run:` scripts only when it finds ShellCheck on `PATH`:

```bash
actionlint
```

Lint the commit messages of your branch with [commitlint](https://commitlint.js.org), the same check CI runs on every pull request. Commit messages and pull request titles follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), and [`.commitlintrc.json`](.commitlintrc.json) holds the rules:

```bash
pnpm exec commitlint --from origin/main
```

## Git hooks

`pnpm install` installs git hooks with [lefthook](https://lefthook.dev), so formatting, Markdown, and commit message problems surface before CI runs. [`lefthook.yaml`](lefthook.yaml) defines them:

- `pre-commit` formats the staged files with Prettier and fixes the staged Markdown files with markdownlint, then adds the fixes to the commit. The commit stops when markdownlint finds a problem it cannot fix.
- `commit-msg` lints the commit message with commitlint.

Set `LEFTHOOK=0` to skip the hooks for one command:

```bash
LEFTHOOK=0 git commit
```

## Dependency updates

[Renovate](https://docs.renovatebot.com) opens a pull request as soon as an update is out, and [`.github/renovate.json`](.github/renovate.json) holds its config. npm packages first wait 3 days after their release, the same age pnpm requires before it installs them. The Dependency Dashboard issue lists every pending update.

Renovate merges these updates without review once the checks pass, since it may bypass the code owner review of the `Reviews` ruleset:

- Minor, patch, and digest updates of the development tools, the actions, the runners, and the Docker images in workflows.
- Lock file maintenance, which refreshes the transitive dependencies early on Monday mornings.

Every other update waits for a review: majors, Node.js and pnpm in `devEngines`, and dependencies outside the development tools. A new major of Node.js or pnpm first waits for approval on the Dependency Dashboard. Add each new catalog of development tools to the auto-merge rule in the config; the updates of any other catalog wait for review.

## License

D&D Mapp is released under the [MIT License](LICENSE).
