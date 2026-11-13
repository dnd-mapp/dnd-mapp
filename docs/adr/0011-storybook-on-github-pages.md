# 0011. The workflows publish Storybook to GitHub Pages from a gh-pages branch

- **Status:** Accepted
- **Date:** 2026-11-13
- **Built in:** [#264](https://github.com/dnd-mapp/dnd-mapp/pull/264)

## Context

The [Storybook](../../packages/ui/web/README.md#storybook) of `ui-web` shows each component in the states its stories set up. Until now it ran only on a machine with a checkout, so reviewers and designers could neither compare the components with their [Penpot designs](../design.md) nor see how a pull request changes a component before it merges.

The site has to serve the Storybook of `main` and one preview per open pull request at once, and drop a preview when its pull request closes. Each deploy shows on the pull request or the environment it belongs to, and succeeds only once the site serves its commit, as the deploys of the web image do.

## Decision

The workflows publish Storybook to GitHub Pages at <https://dnd-mapp.github.io/dnd-mapp/>, with `main` at the root and each pull request under `pr/<number>/`. A `gh-pages` branch holds the site, and Pages deploys from it. [CI](../ci.md#storybook) describes the jobs. The reasons:

- **Each deploy replaces only its own folder.** The [`publish-pages`](../../.github/actions/publish-pages/action.yaml) action fetches `gh-pages`, swaps one folder, and pushes the tree as one orphan commit with `--force-with-lease`. A rejected push fetches again and reapplies its folder, so concurrent deploys of `main` and the pull requests never overwrite each other. No concurrency group spans them, since GitHub keeps one pending run per group and would cancel a waiting preview.
- **The branch stays one commit deep.** Every preview of every pull request would otherwise stay in the history, so clones and `fetch-depth: 0` checkouts would grow with each push.
- **The previews share one environment.** The `storybook-preview` deployments go through the REST API with `transient_environment: true` and `auto_inactive: false`, so a new preview leaves those of other pull requests active. Their payload names the pull request, which lets later runs mark its deployments inactive.
- **The workflows own the deploy.** It is a short script in the repository, with no third-party action that holds a token with write access to the contents.

## Alternatives

- **Deploying from Actions artifacts, with `actions/deploy-pages`.** Each deploy replaces the whole site, so a preview would have to rebuild or download the Storybook of `main` and every other open pull request, or wipe them.
- **A branch with GitHub Actions as the Pages source.** It still needs a workflow that uploads the whole branch as an artifact after each push, which adds a run without changing the branch model.
- **A maintained preview action, such as [`rossjrw/pr-preview-action`](https://github.com/rossjrw/pr-preview-action).** It builds on the same `gh-pages` model, but keeps the history of the branch and leaves the deployments to the caller, and its token holds write access to the contents.
- **An environment per pull request.** Its deployments would show apart, but nothing can delete the environment when the pull request closes without a GitHub App with Administration write.
- **Previews for pull requests from forks.** A fork gets a read-only token, so its preview needs a `pull_request_target` or `workflow_run` workflow that builds untrusted code with a token that can push. Only maintainers open pull requests for now, as [`GOVERNANCE.md`](../../GOVERNANCE.md#contributors) says, so forks get no preview and their runs may fail.

## Consequences

- The site is public, previews included. A `robots.txt` at the root of the site disallows `/pr/`, but crawlers read it only at the root of the host, which belongs to a `dnd-mapp.github.io` repository that the org does not have. It takes effect once the org adds that site or a custom domain.
- The deploys force-push unsigned commits, so the ruleset of `gh-pages` cannot block force pushes or require signatures. GitHub rejects GitHub Actions as a bypass actor of a ruleset in this repository, so the ruleset cannot restrict updates either: it only blocks deletion, and anyone with write access can push to `gh-pages`.
- A deploy succeeds once Pages serves its commit, so each one waits for the `pages build and deployment` run that the push starts.
- Every deploy fetches the whole site, previews of open pull requests included, which grows with the number of open pull requests that change `ui-web`.

## Revisit when

- Pages deploys from Actions artifacts into one folder of a site, keeping the rest.
- Contributors outside the maintainers open pull requests from forks, and those need previews.
- The site outgrows the [limits of GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), 1 GB per site.
