# Dependency updates

[Renovate](https://docs.renovatebot.com) opens a pull request as soon as an update is out, and [`.github/renovate.json`](../.github/renovate.json) holds its config. npm packages first wait 3 days after their release, the same age pnpm requires before it installs them. The Dependency Dashboard issue lists every pending update.

## What merges without review

Renovate merges these updates once the checks pass, since it may bypass the code owner review of the `Reviews` ruleset:

- Minor, patch, and digest updates of the development tools, the actions, the runners, and the Docker images in workflows.
- Lock file maintenance, which refreshes the transitive dependencies early on Monday mornings.

Every other update waits for a review: majors, Node.js and pnpm in `devEngines`, and dependencies outside the development tools. A new major of Node.js or pnpm first waits for approval on the Dependency Dashboard.

Renovate leaves the images the project publishes, `dndmapp/*`, alone, since their tags move with every push to `main`.

## Adding a catalog

Renovate tells the development tools apart by their catalog in [`pnpm-workspace.yaml`](../pnpm-workspace.yaml). Add each new catalog of development tools to the auto-merge rule in `.github/renovate.json`; the updates of any other catalog wait for review.
