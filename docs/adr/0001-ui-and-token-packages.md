# 0001. Separate packages hold the UI components and the design tokens

- **Status:** Accepted
- **Date:** 2026-11-11
- **Built in:** [#197](https://github.com/dnd-mapp/dnd-mapp/issues/197)

## Context

The [design system](../design.md) in Penpot holds 18 components and the full token set, and [Build the design system in code](https://github.com/dnd-mapp/dnd-mapp/issues/199) brings them into the repository. No component or token exists in code yet, so this is the moment to choose where they go, before any code depends on the choice.

The [dependency rules](../architecture.md#dependency-rules) offer no natural home. An app depends on the `core` of its platform only, and a module on `core` and on the `domain` packages. Components shared by every web app and module therefore fit only in `core-web`, which also holds the root component, the app config, and the routes. The tokens are no module of an app at all: they start as a Penpot JSON export and become CSS that any platform could read.

## Decision

Two new packages hold them, which [#197](https://github.com/dnd-mapp/dnd-mapp/issues/197) creates:

- **`@dnd-mapp/design-tokens`**, at `packages/design-tokens` and tagged `tooling`. It holds the Penpot JSON export and the CSS generated from it. Tokens belong to no platform, and as a package for the whole workspace, every project may read them.
- **`@dnd-mapp/ui-web`**, at `packages/ui/web` with the id `ui-web` and tagged `web`. It holds the components. Every web app and module may import it, while it imports only packages for the whole workspace. That keeps it below `core-web` and the domain modules, so none of them forms a cycle with it.

The components are presentational: they take their content through content projection and their state through inputs, and use no router or app state. The wiring stays in `core-web` or in the domain module that uses them. Theme picker is the one exception: it reads and saves the color scheme through the `ThemeService` that [#210](https://github.com/dnd-mapp/dnd-mapp/issues/210) adds to `ui-web`. The color scheme is a setting of the reader's browser rather than app state, so the service needs nothing outside the package.

Storybook lives in `ui-web` and documents the components, so each can be checked against its Penpot design. Vitest specs test them, as they test every other project; the stories are no tests. [#198](https://github.com/dnd-mapp/dnd-mapp/issues/198) records how Storybook is set up.

## Alternatives

- **Components in `core-web`.** This needs no exception to the dependency rules. But `core-web` would mix the shell of the app with the pieces that build it, and a component could reach the router or app state by accident. Storybook and the component specs would also compile the whole shell.
- **Components in a workspace package, `packages/ui`.** A package for the whole workspace is tagged `tooling`, which every project may depend on, server and `domain` projects included. Angular components belong to the web platform only, and the `<domain>/<slot>` layout of `packages/ui/web` leaves room for the components of another platform next to it.
- **Tokens in `packages/ui/tokens`.** The slot of a module names the platform it runs on, and `tokens` names none. The tokens would also take the `web` tag, which keeps them from the projects of every other platform.

## Consequences

- The dependency rules gain an exception: every web app and module may import `ui-web`. [#197](https://github.com/dnd-mapp/dnd-mapp/issues/197) adds it to `module-boundaries.ts` and to the [Architecture](../architecture.md) guide. moon needs no change, since `tagRelationships` already lets a `web` project depend on `web` and `tooling` projects.
- A component that needs the router or app state can't take it in `ui-web`. The app or domain module that uses it passes the state in through inputs, or wraps it in a component of its own.
- `ThemeService` puts one piece of state in `ui-web`. A second service that wants to join it needs the same reason: a setting of the reader's browser, not state of the app.
- The workspace has two more projects to keep up, each with its README and `moon.yml`.

## Revisit when

- A component can't do its work without the router or app state.
- A second platform needs the components, and shares enough of them that one package for both pays off.
- The tokens need a format or a build step that only one platform reads.
