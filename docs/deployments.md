# Deployments

This guide describes where the web client runs, how a workflow deploys it there, and how to roll an environment back. [CI](ci.md) covers the workflows that build the image, and [Releasing](releasing.md) covers the releases that reach staging and production.

## Environments

Each environment runs a container of the [web image](https://hub.docker.com/r/dndmapp/web) that follows one of its tags:

| Environment | URL                                 | Container         | Follows  | Deployed by                                              |
|:------------|:------------------------------------|:------------------|:---------|:---------------------------------------------------------|
| development | <https://dev.dndmapp.nl.eu.org>     | `dndmapp-dev`     | `edge`   | The `Deploy development` job of `Push main`.             |
| staging     | <https://staging.dndmapp.nl.eu.org> | `dndmapp-staging` | `latest` | The `Deploy staging` job of `Release`.                   |
| production  | <https://www.dndmapp.nl.eu.org>     | `dndmapp-prod`    | `latest` | The `Deploy production` job of `Release`, after staging. |

Each environment serves `build-info.json`, which reports the commit and version of the build it runs:

```bash
curl https://dev.dndmapp.nl.eu.org/build-info.json
```

The `pr-<number>` image of a pull request runs in no environment. Run it on your machine at <http://localhost:4200>, or run the end-to-end tests against it, as the [end-to-end tests README](../e2e/web/README.md) describes:

```bash
docker run --rm -p 4200:4200 dndmapp/web:pr-<number>
```

## How a deploy works

Watchtower updates the containers, but only when a workflow asks it to, so moving a tag alone changes no environment. A deploy job:

1. Joins the tailnet as `tag:ci`, which reaches only the Watchtower API.
2. Asks Watchtower to pull the tag that the container follows and restart the container.
3. Waits up to 60 seconds until the public `build-info.json` of the environment reports the commit of the new image, and fails otherwise.

Each deploy job runs in the GitHub environment of the same name, in the concurrency group `deploy-<environment>`. A group runs one deploy at a time, and a new deploy never cancels one that runs, so no update stops halfway. The deploys of `Push main`, `Release`, and `Roll back` share these groups.

## Development

Development runs the latest commit of `main` that changed the web app. The `Deploy development` job waits for the end-to-end tests of the new image, so a commit that fails them moves `edge` but leaves development on its previous image. A commit that builds no web image leaves development as it is.

When several pushes land in a row, a newer deploy may replace one that still waits for its turn. That is safe, since `edge` points at the newest image anyway.

## Staging and production

Staging and production both run `latest`, which only a release of `web` moves. The `Release` workflow deploys staging first and runs the end-to-end tests against it, then deploys production once they pass. [What the release workflow checks](releasing.md#what-the-release-workflow-checks) describes each job.

## Rolling back

Watchtower pulls only the tag that a container follows, so the `Roll back` workflow takes a broken build out of an environment by moving that tag to an earlier image. It doesn't replace the fix: revert or fix the change in a pull request to `main` for development, or ship the next release for staging and production, as [From a wrong release](releasing.md#from-a-wrong-release) describes. Run the workflow from the Actions tab, or with `gh`:

```bash
gh workflow run roll-back.yaml --field target=release --field tag=0.1.0
```

| Input    | Takes                                                                                                                                       |
|:---------|:--------------------------------------------------------------------------------------------------------------------------------------------|
| `target` | `development`, which moves `edge`, or `release`, which moves `latest` and rolls back staging and production together, since both follow it. |
| `tag`    | The image to roll back to: a `sha-<short>` tag of a commit of `main` for `development`, or a release version such as `0.1.0` for `release`. |

The workflow fails before it moves a tag when `tag` doesn't fit `target` or doesn't exist on Docker Hub. Otherwise it points the tag at the image, has Watchtower update each container, and waits until the `build-info.json` of each environment reports the commit in the `org.opencontainers.image.revision` label of the image. The `Restrict who can roll back an environment` Actions policy lets only the maintain and admin roles dispatch it. The policy names the workflow by its path, as the [bump's policy](releasing.md#from-a-failed-bump) does.

Keep in mind:

- **Development stays rolled back only until the next merge that rebuilds the image**, since that moves `edge` again.
- **`sha-<short>` exists only for commits that changed the web app.** The tag takes the first seven characters of the commit, as `git rev-parse --short=7 <commit>` prints them. Check that it exists with `docker buildx imagetools inspect dndmapp/web:sha-<short>`.
- **Moving `latest` also changes what anyone who pulls `dndmapp/web` gets.** The `<major>.<minor>` and `<major>` tags stay on the broken release until the next release moves them.
- **A rollback waits for a deploy that runs in the same environment.** A release that hasn't reached production yet stops at its next check of `latest`, as [From a superseded release](releasing.md#from-a-superseded-release) describes.
- **A rollback stops when a newer run moves the tag while it waits**, with an error that names the image the tag points at. The newer run deploys that image, so dispatch the rollback again when it is broken too.
