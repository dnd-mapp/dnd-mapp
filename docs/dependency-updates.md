# Dependency updates

[Renovate](https://docs.renovatebot.com) opens a pull request as soon as an update is out, and [`.github/renovate.json`](../.github/renovate.json) holds its config. npm packages first wait 3 days after their release, the same age pnpm requires before it installs them. The Dependency Dashboard issue lists every pending update.

## What merges without review

Renovate merges these updates once the checks pass, since it may bypass the code owner review of the `Reviews` ruleset:

- Minor, patch, and digest updates of the development tools, the actions, the runners, and the Docker images in workflows.
- Lock file maintenance, which refreshes the transitive dependencies early on Monday mornings.

Every other update waits for a review: majors, Node.js and pnpm in `devEngines`, and dependencies outside the development tools. A new major of Node.js or pnpm first waits for approval on the Dependency Dashboard.

Renovate leaves the images the project publishes, `dndmapp/*`, alone, since their tags move with every push to `main`.

## Adding a dependency

Every dependency from npm takes its version from a named catalog in [`pnpm-workspace.yaml`](../pnpm-workspace.yaml), the one of its tool family, such as `angular` or `eslint`. Add the version to that catalog, and reference it from the `package.json` of the project as `catalog:<name>`:

```json
"@angular/core": "catalog:angular"
```

With `catalogMode: strict`, pnpm accepts only versions from a catalog. Give a dependency that fits none of the catalogs a new catalog, and tell Renovate about it when it holds development tools, as [Adding a catalog](#adding-a-catalog) describes.

## Adding a catalog

Renovate tells the development tools apart by their catalog in [`pnpm-workspace.yaml`](../pnpm-workspace.yaml). Add each new catalog of development tools to the auto-merge rule in `.github/renovate.json`; the updates of any other catalog wait for review.
