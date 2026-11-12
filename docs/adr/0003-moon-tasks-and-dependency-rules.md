# 0003. moon runs every task and checks the dependency rules

- **Status:** Accepted
- **Date:** 2026-10-28
- **Built in:** [#30](https://github.com/dnd-mapp/dnd-mapp/pull/30) and [#78](https://github.com/dnd-mapp/dnd-mapp/pull/78)

## Context

The workspace holds apps, their modules, packages for the whole workspace, and end-to-end tests, for a web client now and a server later. CI should run only the tasks that a change affects, and each project should run its checks the same way. The [dependency rules](../architecture.md#dependency-rules) also need a check, since the path aliases of `tsconfig.base.json` let any project import any module, and review alone would miss a broken rule.

## Decision

[moon](https://moonrepo.dev) runs every task. The tasks live in each `moon.yml` and in `.moon/tasks/`, not in `package.json`, and projects share them through inheritance.

Two layers check the dependency rules, since neither catches everything:

- **moon** checks the dependencies that each `package.json` declares. `constraints.tagRelationships` in `.moon/workspace.yml` fails the project graph on a dependency between incompatible tags, or on one on a project without a tag, so every `moon` command reports it.
- **`eslint-plugin-boundaries`**, through the presets of `@dnd-mapp/config-eslint`, checks the imports in the code. It fails the `lint` task on an import that breaks the rules, `import()` included, and on an import of a package that `package.json` doesn't declare. moon sees no imports, and can't express that a module depends on its own domain only.

The reasons:

- Tasks stay out of `package.json`, and a task that several projects run is defined once and inherited.
- moon checks the dependency rules on its project graph, with no plugin.
- moon works for any language, so a server app or a tool outside JavaScript can join the workspace under the same tasks and rules.

## Alternatives

- **[Nx](https://nx.dev) with [`@nx/enforce-module-boundaries`](https://nx.dev/docs/features/enforce-module-boundaries).** Its lint rule checks imports and `package.json` dependencies by tag, which would cover both layers in one. But the rule is an Nx plugin, and Nx brings support for each further language through plugins as well.
- **[Turborepo](https://turborepo.dev) with [`turbo boundaries`](https://turborepo.dev/docs/reference/boundaries).** Turborepo runs the scripts of each `package.json`, so the tasks would stay there, and `turbo boundaries` is still experimental.
- **Plain pnpm with [`pnpm pipeline`](https://pnpm.io/cli/pipeline).** It needs no further tool, but it is experimental since pnpm 12.4.0, and pnpm checks no dependency rules.
- **Rush, Lage, and Bazel.** Rush and Lage run the scripts of each `package.json`. Bazel works for any language, but asks for build files and toolchain rules in every project, more than a workspace of this size repays.
- **[dependency-cruiser](https://github.com/sverweij/dependency-cruiser) for the rules.** It checks imports against rules on paths, as a tool of its own next to ESLint. `eslint-plugin-boundaries` runs in the `lint` task that each project already has, and the editor shows its findings as you type.

## Consequences

- moon has one main author, so its future rests on few people.
- [moon v2.0](https://github.com/moonrepo/moon/releases/tag/v2.0.0) renamed and removed many settings, so a major release can mean edits across every `moon.yml`.
- Moving away from moon means rewriting every task, since none lives in `package.json`.
- A change to the rules touches both layers: `tagRelationships` in `.moon/workspace.yml`, and the rule in `@dnd-mapp/config-eslint`.
- moon's cache stays on each machine, so every CI run starts without it, and only the affected-only runs keep CI short.

## Revisit when

- moon's releases stall.
- `pnpm pipeline` becomes stable.
- CI needs a cache across runs.
