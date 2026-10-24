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

## License

D&D Mapp is released under the [MIT License](LICENSE).
