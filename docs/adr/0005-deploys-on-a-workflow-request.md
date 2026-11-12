# 0005. Watchtower updates a container only when a workflow asks it to

- **Status:** Accepted
- **Date:** 2026-11-06
- **Built in:** [#124](https://github.com/dnd-mapp/dnd-mapp/pull/124)

## Context

Each [environment](../deployments.md#environments) runs a container of the web image on one host, and the container follows a tag: development follows `edge`, and staging and production both follow `latest`. When a tag moves, something has to pull the new image and restart the container. A release has to reach staging and pass its end-to-end tests there before production takes it, and CI has to learn whether each deploy succeeded.

## Decision

[Watchtower](https://github.com/nicholas-fedor/watchtower) runs on the host and updates a container only when a workflow calls its HTTP API, as [How a deploy works](../deployments.md#how-a-deploy-works) describes. A deploy job joins the tailnet as `tag:ci`, asks Watchtower to update one container, and waits until the environment serves the new commit.

The reasons:

- CI gates each environment and learns whether the deploy succeeded. With polling, production would take a new `latest` before the tests on staging ran.
- A leaked credential can only update the containers to the tags they follow, with no shell on the host.
- The host runs one small extra container, and the tailnet keeps its API off the internet.

## Alternatives

- **Watchtower polling for new images.** It needs no workflow at all, but CI could neither gate production on staging nor learn the outcome of a deploy.
- **SSH with `docker compose up --wait`.** CI would gate each environment and learn the outcome, but a leaked key would give a shell on the host.
- **A self-hosted runner on the host.** Workflow code would run on the host itself, and GitHub [advises against](https://docs.github.com/en/actions/reference/security/secure-use#hardening-for-self-hosted-runners) self-hosted runners for public repositories, since a pull request can run code on them.
- **A deploy agent or a self-hosted PaaS**, such as [Komodo](https://komo.do), [Portainer](https://www.portainer.io), [Coolify](https://coolify.io), or [Dokku](https://dokku.com). Each can deploy on a request from CI, but runs a larger service with its own access to Docker, more to keep up and secure than one container.
- **GitOps on Kubernetes, with [Argo CD](https://argo-cd.readthedocs.io) or [Flux](https://fluxcd.io).** It needs a cluster, which the current hosting hardware can't carry.
- **A managed platform, such as [Fly.io](https://fly.io) or [Render](https://render.com).** It would move the environments off the project's own hardware, for a monthly cost.

## Consequences

- [`containrrr/watchtower`](https://github.com/containrrr/watchtower) was archived in December 2025, so the deploys depend on the [`nicholas-fedor/watchtower`](https://github.com/nicholas-fedor/watchtower) fork, which has one maintainer. This is an accepted risk.
- Each restart takes the container down briefly.
- A [rollback](../deployments.md#rolling-back) moves public tags such as `latest`, since Watchtower pulls only the tag that a container follows.

## Revisit when

- The fork stalls.
- The hosting hardware grows. With better hardware, the lead maintainer plans to move to Kubernetes with Argo CD, or a similar GitOps setup.
