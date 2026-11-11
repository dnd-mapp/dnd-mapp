# 0002. Named pnpm catalogs, one per tool family, hold every version

- **Status:** Accepted
- **Date:** 2026-10-23
- **Built in:** [#2](https://github.com/dnd-mapp/dnd-mapp/pull/2)

## Context

The apps, modules, and packages of the workspace share most of their dependencies, such as the Angular framework, ESLint and its plugins, and Vitest. With a range in each `package.json`, nothing keeps the projects on one version of a package. Renovate also needs a line between the updates it merges on its own and the ones that wait for review, and the framework packages need to update together, although Angular, RxJS, and TypeScript come from different upstream repositories.

## Decision

Every dependency from npm takes its version from a named [catalog](https://pnpm.io/catalogs) in [`pnpm-workspace.yaml`](../../pnpm-workspace.yaml), the one of its tool family, such as `angular`, `eslint`, or `vitest`. `catalogMode: strict` keeps `pnpm add` and `pnpm update` to the catalogs.

The reasons:

- Each package has one version across the projects.
- Renovate draws the line between updates it merges and updates that wait for review by tool family. The auto-merge rule in [`.github/renovate.json`](../../.github/renovate.json) lists each catalog of development tools, so the updates of every other catalog wait for review.
- The packages of one catalog update in one pull request, even when they come from different upstream repositories. Renovate's monorepo presets group packages by upstream repository only, so they would split Angular, RxJS, and TypeScript.

Tested against pnpm 12.18.0, `catalogMode: strict` enforces this:

- `pnpm add` writes each new dependency to a catalog and references it as `catalog:<name>`. It writes to the default catalog unless `--save-catalog-name` names another, even when a named catalog already lists the package.
- `pnpm add` and `pnpm update` fail on a range outside the one the catalog sets.
- `pnpm install` checks nothing: a range typed into a `package.json` by hand installs, with `--frozen-lockfile` too, and `pnpm update` keeps it a plain range.

## Alternatives

- **No catalogs, kept in sync by [syncpack](https://github.com/JamieMason/syncpack) or [manypkg](https://github.com/Thinkmill/manypkg).** The ranges stay in each `package.json`, and another tool checks that they match. Renovate would then have no tool family to draw its line by.
- **A single default catalog.** Each package keeps one version, but the catalog no longer tells the tool families apart. Renovate's rules would list the packages one by one.
- **Catalogs per role or per app.** A catalog per app brings back a version per app. A catalog per role, such as `dev` and `runtime`, splits a family: the build tools and the runtime packages of Angular would update in separate pull requests.
- **Every dependency at the root.** Each package keeps one version, but the projects stop declaring what they use. moon builds its project graph from those declarations, and the ESLint rule of [ADR 0003](0003-moon-tasks-and-dependency-rules.md) checks each import against them.

## Consequences

- Each new catalog of development tools needs an edit of `.github/renovate.json`, as [Adding a catalog](../dependency-updates.md#adding-a-catalog) describes. A catalog left out fails safe, since its updates wait for review.
- `pnpm add` needs `--save-catalog-name <name>`. Without it, the package lands in the default catalog, next to the named one that may already list it.
- A range typed into a `package.json` by hand passes the strict mode, so only review catches it.
- npm reads no catalogs, so a move to npm would mean writing every version back into each `package.json`. That matters little: a move to npm is highly unlikely, since pnpm's benefits outweigh it.

## Revisit when

- A project needs a second version of a package.
