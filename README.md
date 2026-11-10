# D&D Mapp

The monorepo for D&D Mapp: it holds all packages and applications of the project.

## Status

Early development: the repository holds the scaffold of the web client in [`apps/web`](apps/web/README.md) and its core in [`packages/core/web`](packages/core/web/README.md), and no features yet.

## Getting started

[Development](docs/development.md) lists the tools to install, then sets up the repository and serves the web client in four steps.

## Documentation

The guides in [`docs/`](docs) cover the workspace as a whole:

| Guide                                            | Covers                                                                                   |
|:-------------------------------------------------|:-----------------------------------------------------------------------------------------|
| [Development](docs/development.md)               | The tools, the first run, the tasks of the whole repository, the git hooks, and editors. |
| [Architecture](docs/architecture.md)             | The kinds of projects, the dependency rules between them, and how to add a project.      |
| [Dependency updates](docs/dependency-updates.md) | Which updates Renovate merges on its own, and which wait for review.                     |
| [Releasing](docs/releasing.md)                   | How a maintainer releases a project, and how to recover when a step fails.               |

## Projects

Each project's README says what the project is for and lists its tasks:

- [`apps/web`](apps/web/README.md): the Angular web client.
- [`e2e/web`](e2e/web/README.md): the end-to-end tests of the web client.
- [`packages/core/web`](packages/core/web/README.md): the core of the web client, which the domain modules build on.
- [`packages/config-typescript`](packages/config-typescript/README.md): the TypeScript config presets that the projects extend.
- [`packages/config-eslint`](packages/config-eslint/README.md): the shared ESLint presets of the projects, which also enforce the dependency rules between them.
- [`packages/common`](packages/common/README.md): the general helpers that any project can use, such as `tryCatch`.
- [`packages/testing`](packages/testing/README.md): the helpers for the tests of any project, such as in-memory mocks of `node:fs` and git.
- [`packages/release`](packages/release/README.md): the CLI that the release workflows run on the changelog and manifest of a project.

## Contributing

[`SUPPORT.md`](SUPPORT.md) lists where to ask a question, propose an idea, or report a problem, and what response to expect.

[`CONTRIBUTING.md`](CONTRIBUTING.md) explains where a contribution starts, the conventions for branches, commits, and changelog entries, how to check your changes, and how a pull request gets reviewed and merged.

[`GOVERNANCE.md`](GOVERNANCE.md) describes how the project is run: its roles, how decisions are made, and how disagreements are resolved.

[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) sets the standard of behavior in the spaces of the project, and explains how to report a breach and how it is enforced.

## License

D&D Mapp is released under the [MIT License](LICENSE).
