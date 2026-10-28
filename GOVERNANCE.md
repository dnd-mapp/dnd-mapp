# Governance

This document describes how D&D Mapp is run today: who holds which role, how decisions are made and recorded, how roles change hands, and how disagreements are resolved. One person leads the project, and the roles below are written so they still hold once more maintainers join.

## Roles

Everyone in every role is accountable for what they submit, whatever tools helped create it, and understands it well enough to explain and defend it. AI tools are welcome on those terms.

### Lead maintainer

The lead maintainer is a maintainer with the final say on every decision. On top of the maintainer responsibilities, the lead maintainer:

- Sets the direction and the roadmap of the project.
- Administers the dnd-mapp GitHub organization and the settings of its repository, such as rulesets, secrets, and teams.
- Handles security advisories.
- Enforces the [code of conduct](CODE_OF_CONDUCT.md).

### Maintainers

Maintainers run the day-to-day work of the project. A maintainer:

- Triages issues by setting their status to Ready on the [D&D Mapp project](https://github.com/orgs/dnd-mapp/projects/10), and assigns them.
- Files the work that comes out of discussions and bug reports, through the issue forms for tasks, research, and epics.
- Reviews and approves pull requests as a member of [@dnd-mapp/reviewers](https://github.com/orgs/dnd-mapp/teams/reviewers), the code owners of the repository.
- Moderates [Discussions](https://github.com/dnd-mapp/dnd-mapp/discussions).

### Contributors

Anyone who takes part in the project is a contributor. A contributor starts a discussion in Ideas or Q&A, reports a bug, or reports a security issue, as [`CONTRIBUTING.md`](CONTRIBUTING.md#where-to-start) describes.

The repository lets only its collaborators open pull requests, so maintainers make all code and docs changes for now. The lead maintainer may reconsider this in the future.

### Automation

`dnd-mapp-bot` is an account that the lead maintainer runs. GitHub does not let authors approve their own pull requests, so the lead maintainer reviews their own pull requests with this account, which is why it belongs to @dnd-mapp/reviewers. It is not a maintainer, and the lead maintainer is accountable for every pull request it approves.

Renovate merges some dependency updates without a review, as the [Dependency updates](README.md#dependency-updates) section of the README explains.

## People

| GitHub                                       | Role            |
|:---------------------------------------------|:----------------|
| [@NoNamer777](https://github.com/NoNamer777) | Lead maintainer |

## Decisions

### Who decides

A single maintainer makes everyday decisions, such as triaging an issue or approving a pull request.

Significant decisions need the approval of the lead maintainer:

- The architecture of the project.
- New runtime dependencies.
- Breaking changes.
- The roadmap.
- Changes to this document.

### Where decisions are recorded

Every decision is recorded where it is made:

- [Discussions](https://github.com/dnd-mapp/dnd-mapp/discussions) hold ideas and questions, and whether an idea becomes work.
- Issues and the [D&D Mapp project](https://github.com/orgs/dnd-mapp/projects/10) hold the accepted work and its status.
- Pull requests hold how the work is built, and the review that accepted it.

## Changing roles

### Becoming a maintainer

The path to maintainer opens together with pull requests from contributors. From then on, the lead maintainer invites contributors who have made sustained, good-quality contributions; there is no fixed count. A contributor who wants the role may ask the lead maintainer.

An invited contributor accepts by opening a pull request that adds them to [People](#people). Once it merges, the lead maintainer adds them to @dnd-mapp/reviewers and to the `maintainers` of the moon projects they look after.

### Stepping down

A maintainer steps down by opening a pull request that moves them from [People](#people) to an Emeritus section below it. The lead maintainer may do the same for a maintainer who has been inactive for six months, after asking them first. Either way, the lead maintainer then removes them from @dnd-mapp/reviewers and from the `maintainers` of the moon projects.

### Succession

When the lead maintainer steps down, they hand the role, and the ownership of the dnd-mapp GitHub organization, to a maintainer. When no maintainer can take over, they archive the repository.

No successor exists today, so the project stops if the lead maintainer can no longer lead it.

## Disagreements

Disagreements about the project are discussed on the issue, pull request, or discussion where they come up. When the maintainers cannot agree, the lead maintainer decides and writes the reasoning in that thread.

A complaint about someone's behavior follows the [code of conduct](CODE_OF_CONDUCT.md), not this process.

## Funding

Sponsorships through the Sponsor button go to the [Ko-fi](https://ko-fi.com/nonamer777) of the lead maintainer. Sponsoring supports the project and gives no say in its decisions.
