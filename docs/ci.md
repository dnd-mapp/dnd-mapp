# CI

This guide describes the GitHub Actions workflows in [`.github/workflows/`](../.github/workflows): what each one runs, on which event, and what it publishes. [Deployments](deployments.md) covers the environments that the workflows deploy to, and [Releasing](releasing.md) covers the release workflows step by step.

## Workflows

| Workflow                                                                 | Runs on                         | Does                                                                                                                |
|:-------------------------------------------------------------------------|:--------------------------------|:--------------------------------------------------------------------------------------------------------------------|
| [`Pull request`](../.github/workflows/pull-request.yaml)                 | Every push to a pull request    | Runs the checks, builds the pull request's web image, runs the end-to-end tests, and publishes a Storybook preview. |
| [`Pull request edited`](../.github/workflows/pull-request-edited.yaml)   | An edit to a pull request       | Lints the title again, so a fixed title passes without a new push.                                                  |
| [`Pull request closed`](../.github/workflows/pull-request-closed.yaml)   | A pull request merges or closes | Deletes the `pr-<number>` tag of the web image from Docker Hub, and the Storybook preview from the site.            |
| [`Push main`](../.github/workflows/push-main.yaml)                       | Every push to `main`            | Runs the same checks, then builds the web image, deploys development, and publishes Storybook.                      |
| [`Release pull request`](../.github/workflows/release-pull-request.yaml) | A dispatch by a maintainer      | Bumps the version of a project and opens its release pull request.                                                  |
| [`Release`](../.github/workflows/release.yaml)                           | A push of a `*@v*` tag          | Publishes the release, then deploys staging and production.                                                         |
| [`Roll back`](../.github/workflows/roll-back.yaml)                       | A dispatch by a maintainer      | Moves an image tag back to an earlier image, as [Rolling back](deployments.md#rolling-back) describes.              |
| [`Issue closed`](../.github/workflows/issue-closed.yaml)                 | An issue closes                 | Removes every assignee from the issue.                                                                              |

The composite actions in [`.github/actions/`](../.github/actions) hold the steps that more than one workflow runs, such as `setup`, which installs pnpm and the dependencies, and `ci`, which runs the checks.

## Pull requests and main

`Pull request` and `Push main` run the same jobs, with a few differences that the table names. moon decides which of them have work to do, so a change to the docs runs the checks but builds no image:

| Job                      | Does                                                                                                                                                      | Runs when                                                             |
|:-------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------|
| `Changes`                | Lists the moon tasks that the changes affect, between the base and the head of the pull request or the push.                                              | Always.                                                               |
| `CI`                     | Lints the commit messages of a pull request, runs the affected check tasks with `moon ci`, and lints the workflows with actionlint.                       | Always.                                                               |
| `Web image`              | Builds the web image and pushes it to Docker Hub, as [The web image](#the-web-image) describes. It runs next to `CI`, so a failing check still pushes it. | The changes affect `web:image`.                                       |
| `End-to-end tests`       | Runs `web-e2e:e2e-ci` against the image of the `Web image` job, or against `edge` when that job skipped.                                                  | The changes affect `web:image` or `web-e2e:e2e-ci`.                   |
| `Storybook preview`      | Publishes the Storybook of the pull request under `pr/<number>/`, as [Storybook](#storybook) describes.                                                   | Pull requests only, when the changes affect `ui-web:build-storybook`. |
| `Pull request title`     | Lints the title of the pull request as a Conventional Commit subject.                                                                                     | Pull requests only.                                                   |
| `Deploy development`     | Has development pull the new `edge` image, as [Deployments](deployments.md#development) describes.                                                        | `main` only, after `End-to-end tests` passes.                         |
| `Storybook`              | Publishes the Storybook of `main` to the root of the site, as [Storybook](#storybook) describes.                                                          | `main` only, when the changes affect `ui-web:build-storybook`.        |
| `Docker Hub description` | Publishes the overview and short description of the web image, as [The web image](#the-web-image) describes.                                              | `main` only, when the push changes either file.                       |

The `CI` job runs the tasks `build-storybook`, `check`, `format-check`, `lint`, `lint-changelog`, `lint-md`, `lint-short-description`, `test-ci`, and `typecheck` of every affected project. `build-storybook` builds the [Storybook](../packages/ui/web/README.md#storybook) of `ui-web`, so a story that does not compile fails the job. `check` of [`design-tokens`](../packages/design-tokens/README.md) fails when the committed `tokens.css` differs from what its build generates from `tokens.json`. [Checking your changes](../CONTRIBUTING.md#checking-your-changes) gives the command that runs the same checks on your machine, and [Review and merge](../CONTRIBUTING.md#review-and-merge) lists the checks that a pull request needs to merge.

The findings of ESLint, markdownlint, actionlint, and the unit tests show as annotations on the pull request. A comment lists every task that moon ran or skipped, and each later push updates it. On `main`, the job summary of the run holds that list instead.

When `End-to-end tests` fails, the run keeps the HTML report of Playwright for 7 days as the `playwright-report` artifact.

## The web image

The `Web image` job builds the `web-gha` target of [`.docker/bake.hcl`](../.docker/bake.hcl) with [`docker/bake-action`](https://github.com/docker/bake-action), rather than running `web:image`. The target builds the app once on the platform of the runner, then the image for `linux/amd64` and `linux/arm64`. It attaches an SBOM and a provenance attestation to each image, and caches its layers in the GitHub Actions cache. [`docker/metadata-action`](https://github.com/docker/metadata-action) computes its tags and its version, revision, and creation labels. `build-info.json` in the image reports the head commit of the pull request or push, and the version of the image.

Each event pushes or moves these tags of [`dndmapp/web`](https://hub.docker.com/r/dndmapp/web) on Docker Hub:

| Event                         | Tags                                                                                                    |
|:------------------------------|:--------------------------------------------------------------------------------------------------------|
| Push to a pull request        | `pr-<number>`                                                                                           |
| Pull request merged or closed | Deletes `pr-<number>`                                                                                   |
| Push to `main`                | `sha-<short>` and `edge`                                                                                |
| Release                       | `<version>`, `<major>.<minor>`, `<major>`, and `latest`. A version below `1.0.0` gets no `<major>` tag. |
| Rollback                      | Moves `edge` or `latest` to an earlier image, as [Rolling back](deployments.md#rolling-back) describes. |

Docker Hub keeps one overview per repository rather than per tag, so only `Push main` publishes the overview in [`.docker/web/README.md`](../.docker/web/README.md) and the short description in [`.docker/web/short-description.txt`](../.docker/web/short-description.txt). A push that changes either file publishes both with [`peter-evans/dockerhub-description`](https://github.com/peter-evans/dockerhub-description). The [web README](../apps/web/README.md) explains how to write them.

## Storybook

The `Storybook` and `Storybook preview` jobs publish the [Storybook](../packages/ui/web/README.md#storybook) of `ui-web` to GitHub Pages. Like the `Web image` job, they run next to `CI`, so a failing check still publishes. [ADR 0011](adr/0011-storybook-on-github-pages.md) records why the site works this way.

| Event                         | Folder                 | URL                                                | Environment                                        |
|:------------------------------|:-----------------------|:---------------------------------------------------|:---------------------------------------------------|
| Push to `main`                | The root               | <https://dnd-mapp.github.io/dnd-mapp/>             | `storybook`                                        |
| Push to a pull request        | `pr/<number>/`         | `https://dnd-mapp.github.io/dnd-mapp/pr/<number>/` | `storybook-preview`                                |
| Pull request merged or closed | Deletes `pr/<number>/` | None                                               | Marks the deployments of the pull request inactive |

The `gh-pages` branch holds the site as one commit without parents. Each deploy builds Storybook, then runs the [`publish-pages`](../.github/actions/publish-pages/action.yaml) action, which:

1. Writes a `build-info.json` that reports the commit into the build.
2. Fetches `gh-pages` and replaces its own folder. A deploy to the root keeps `pr/`.
3. Writes `.nojekyll` at the root, so Pages serves the files as they are, and a `robots.txt` that disallows `/pr/`.
4. Pushes the tree as a new commit without parents, with `--force-with-lease`. When another deploy pushed in between, it fetches again and starts over, up to 5 times.

Pages deploys the branch in a `pages build and deployment` run of its own, so the job then waits up to 10 minutes until the `build-info.json` of its folder reports the commit.

`main` deploys through the `storybook` environment of its job. The previews share the `storybook-preview` environment, whose deployments the job creates through the REST API on the head commit of the pull request. The pull request links its preview that way, and the previews of other pull requests stay active. A new preview marks the earlier deployments of its pull request inactive, and `Pull request closed` marks all of them inactive. Pull requests from forks get no preview, since their token cannot push.

### Setting up Pages

A maintainer sets up Pages once:

1. Let the first deploy create `gh-pages`. It fails while it waits for the site, since Pages does not serve the branch yet.
2. Have Pages deploy from the root of `gh-pages`, under **Settings** > **Pages**, or with `gh api repos/dnd-mapp/dnd-mapp/pages -f 'source[branch]=gh-pages' -f 'source[path]=/'`.
3. Add a branch ruleset for `gh-pages` that restricts deletions and updates, with GitHub Actions as a bypass actor. Leave force pushes and signed commits unrestricted, since the deploys force-push unsigned commits.
4. Rerun the failed deploy.

## Caches

The `setup` action caches the pnpm store, which also holds the Node.js runtime. Only `Push main` saves that cache, since every pull request can read the cache of `main`. The `Web image` job keeps its Docker layers in the GitHub Actions cache under the `web` scope.

## Secrets and variables

The workflows read these repository secrets and variables:

| Name                                           | Kind     | Used for                                                                                             |
|:-----------------------------------------------|:---------|:-----------------------------------------------------------------------------------------------------|
| `DOCKERHUB_USERNAME`                           | Variable | The Docker Hub account that pushes and deletes the images.                                           |
| `DOCKERHUB_TOKEN_WRITE`                        | Secret   | Pushing the web image, and moving its tags in a rollback.                                            |
| `DOCKERHUB_TOKEN_DELETE`                       | Secret   | Deleting `pr-<number>` tags, and publishing the overview.                                            |
| `TS_OAUTH_CLIENT_ID`, `TS_OAUTH_CLIENT_SECRET` | Secret   | Joining the tailnet as `tag:ci`, which reaches the Watchtower API of the environments.               |
| `WATCHTOWER_URL`, `WATCHTOWER_API_TOKEN`       | Secret   | Asking Watchtower to update a container. The URL is a secret, so the logs mask the tailnet hostname. |
| `GH_APP_CLIENT_ID`                             | Variable | The `dnd-mapp` GitHub App that commits the release bump and opens the release pull request.          |
| `GH_APP_PRIVATE_KEY`                           | Secret   | Signing in as that app.                                                                              |
