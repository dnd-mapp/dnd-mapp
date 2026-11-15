# Agent instructions

[`CONTRIBUTING.md`](CONTRIBUTING.md) sets the conventions for branches, commits, changelog entries, and pull requests. Read it before your first change in this repository.

## Guides

Read the guide that matches the change before you make it:

- **Setup, tasks, or git hooks:** [Development](docs/development.md).
- **A new project, or an import from another project:** [Architecture](docs/architecture.md), whose dependency rules moon and ESLint enforce.
- **A UI component, a page, or a design token:** [Design](docs/design.md).
- **A dependency, added or updated:** [Dependency updates](docs/dependency-updates.md).
- **A workflow or composite action in `.github/`:** [CI](docs/ci.md).
- **An environment or a rollback:** [Deployments](docs/deployments.md).
- **Personal data, a cookie, or an outside service:** [Privacy](docs/privacy.md).
- **A release:** [Releasing](docs/releasing.md).
- **A guide, a project README, or a community file:** [Writing docs](docs/README.md#writing-docs).
- **A decision that is hard to reverse:** [When to write one](docs/adr/README.md#when-to-write-one) in the ADR README.

## Working in the repository

- Run every task through moon, as `pnpm moon run <project>:<task>`, since the `package.json` files hold no scripts besides `moon`. Each project's README lists its tasks.
- Add a changelog entry for each change that users of an app notice, as [Changelog](CONTRIBUTING.md#changelog) describes.

## Before you commit

Run the checks under [Checking your changes](CONTRIBUTING.md#checking-your-changes), and fix every finding before you commit.
