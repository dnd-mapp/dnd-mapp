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

## License

D&D Mapp is released under the [MIT License](LICENSE).
