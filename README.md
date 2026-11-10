# D&D Mapp

[![Push main](https://github.com/dnd-mapp/dnd-mapp/actions/workflows/push-main.yaml/badge.svg?branch=main)](https://github.com/dnd-mapp/dnd-mapp/actions/workflows/push-main.yaml?query=branch%3Amain)
[![Docker image version](https://img.shields.io/docker/v/dndmapp/web?sort=semver&label=dndmapp%2Fweb)](https://hub.docker.com/r/dndmapp/web)
[![License: MIT](https://img.shields.io/github/license/dnd-mapp/dnd-mapp)](LICENSE)

D&D Mapp is an open-source web app for dungeon masters and players of Dungeons & Dragons 5th edition. It covers the 2014 rules from the System Reference Document 5.1, and users add their own homebrew content on top.

> [!IMPORTANT]
> D&D Mapp is in early development, and none of the features below exist yet.

## Features

Every tool is open to all users, except those marked for dungeon masters (DMs).

### Rules and dice

- Browse a compendium of spells, monsters, items, classes, and the rest of the rules, homebrew included.
- Roll virtual dice.

### Characters

- Build and keep character sheets.
- Keep spell books for any character, whether or not D&D Mapp manages it, and attach a spell book to its character once the character moves into D&D Mapp.

### Worlds and campaigns

- Build worlds, write their lore, and create maps of each world and its locations.
- Manage campaigns and their sessions, and keep notes of each session.
- Share worlds, lore, maps, and notes with your party, or make any of them public.

### Play

- Explore dungeons and other locations from your maps on a virtual tabletop (VTT), and play out combat on a rules engine built on the 5e mechanics. DMs run the session, and players join it.
- Build encounters and write stats for custom monsters (DMs).

## Getting started

[Development](docs/development.md) lists the tools to install, then sets up the repository and serves the web client in four steps.

## Documentation

The [guides in `docs/`](docs/README.md) cover the workspace as a whole, from setting up a machine to releasing a project.

## Projects

This repository is the monorepo of D&D Mapp, holding all its packages and applications. Each project's README says what the project is for and lists its tasks:

- [`apps/web`](apps/web/README.md): the Angular web client.
- [`e2e/web`](e2e/web/README.md): the end-to-end tests of the web client.
- [`packages/core/web`](packages/core/web/README.md): the core of the web client, which the domain modules build on.
- [`packages/config-typescript`](packages/config-typescript/README.md): the TypeScript config presets that the projects extend.
- [`packages/config-eslint`](packages/config-eslint/README.md): the shared ESLint presets of the projects, which also enforce the dependency rules between them.
- [`packages/common`](packages/common/README.md): the general helpers that any project can use, such as `tryCatch`.
- [`packages/testing`](packages/testing/README.md): the helpers for the tests of any project, such as in-memory mocks of `node:fs` and git.
- [`packages/release`](packages/release/README.md): the CLI that the release workflows run on the changelog and manifest of a project.

## Contributing

[`SUPPORT.md`](SUPPORT.md) lists where to ask a question, propose an idea, or report a problem, and what response to expect.

[`CONTRIBUTING.md`](CONTRIBUTING.md) explains where a contribution starts, the conventions for branches, commits, and changelog entries, how to check your changes, and how a pull request gets reviewed and merged.

[`GOVERNANCE.md`](GOVERNANCE.md) describes how the project is run: its roles, how decisions are made, and how disagreements are resolved.

[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) sets the standard of behavior in the spaces of the project, and explains how to report a breach and how it is enforced.

## License

D&D Mapp is released under the [MIT License](LICENSE).
