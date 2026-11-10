# Security policy

This policy covers which versions of D&D Mapp get security fixes, what is in scope, how to report a vulnerability privately, and what happens after you report one.

## Supported versions

Security fixes land on `main` and ship in the next release. Older releases get no fixes, so upgrade to the [latest release](https://github.com/dnd-mapp/dnd-mapp/releases).

| Version                                                 | Supported |
|:--------------------------------------------------------|:---------:|
| The latest release of `web` and its `dndmapp/web` image |    Yes    |
| `main`                                                  |    Yes    |
| Older releases                                          |    No     |

## Scope

In scope:

- The code in this repository.
- The `dndmapp/web` image.
- The GitHub Actions workflows of this repository.
- The production site at <https://www.dndmapp.nl.eu.org>.

Where you can, reproduce a weakness against a local `dndmapp/web` container, as [its README](.docker/web/README.md) describes, rather than against production.

Out of scope:

- The `dev` and `staging` environments as test targets. They run `main` and the latest release, so report a weakness against those instead.
- A weakness in a dependency that doesn't affect D&D Mapp.
- Output of a scanner or AI tool that you haven't confirmed in D&D Mapp's code, as [Using AI tools](CONTRIBUTING.md#using-ai-tools) asks.
- Denial of service or load testing against any hosted site.
- Social engineering.

## Reporting a vulnerability

Report a vulnerability privately, never in a public issue, pull request, or discussion:

- Open a [security advisory](https://github.com/dnd-mapp/dnd-mapp/security/advisories/new).
- Without a GitHub account, email [security@dndmapp.nl.eu.org](mailto:security@dndmapp.nl.eu.org).

Include the affected version or commit, the steps to reproduce the weakness, and what an attacker could do with it.

## After you report

The [lead maintainer](GOVERNANCE.md#lead-maintainer) handles every report. D&D Mapp runs on one volunteer, so the times below are goals, not promises:

1. The lead maintainer aims to acknowledge your report within 7 days, and to share an assessment within 14 days.
2. Once the weakness is confirmed, the lead maintainer fixes it in a temporary private fork of the advisory.
3. The fix ships in a release with a `### Security` entry in the changelog, and the advisory is published with it. When one fits, the lead maintainer requests a CVE through GitHub.

Keep the details private until the advisory is published, or for 90 days after your report, whichever comes first.

## Credit

The advisory credits you under the name or handle you choose, or not at all if you ask. D&D Mapp has no bug bounty.
