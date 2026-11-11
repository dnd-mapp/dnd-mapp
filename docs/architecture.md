# Architecture

This guide describes how the workspace is laid out: where each kind of project lives, which project may depend on which, how the modules of an app compile, and how moon defines the tasks. Read it before you add a project, and follow the [checklist](#adding-a-project) at the end.

## Projects

Every project has a folder that tells its kind:

| Folder                     | Holds                                                                    | Example                                               |
|:---------------------------|:-------------------------------------------------------------------------|:------------------------------------------------------|
| `apps/<platform>`          | An app, which holds only what makes it deployable.                       | [`apps/web`](../apps/web/README.md)                   |
| `packages/<domain>/<slot>` | A module of an app, named `@dnd-mapp/<domain>-<slot>`.                   | [`packages/core/web`](../packages/core/web/README.md) |
| `packages/<name>`          | A package for the whole workspace, such as tooling, configs, or helpers. | [`packages/common`](../packages/common/README.md)     |
| `e2e/<platform>`           | The end-to-end tests of an app.                                          | [`e2e/web`](../e2e/web/README.md)                     |

The slot of a module is the platform it runs on, such as `web`, or `domain` for the plain TypeScript that every platform of the domain shares, such as models, validation, and rules. The `core` domain holds the shell of each app that its domain modules build on, as `packages/core/web` does for the web client. The `ui` domain holds the presentational components of each platform, as `packages/ui/web` does for the web client.

Give a module a moon `id` that repeats its name without the scope, such as `core-web`. Set the `id` in `moon.yml` explicitly, since moon names a project after its folder and every app module of a platform shares the folder name of its slot.

Give every project a `project` block in its `moon.yml`, with a title, a description, the owner, and the maintainers, as the existing projects do. `pnpm moon project <id>` and the moon VS Code extension show it, so contributors can see what a project is for and who to ask without opening its code.

## Dependency rules

- An app depends on the `core` and the `ui` module of its platform only.
- A module may depend on the `core` and the `ui` module of its platform, on the `domain` package of its own domain, and on the `domain` package of `core`.
- The `ui` module of a platform, such as `ui-web`, depends on packages for the whole workspace only. That keeps the UI components below `core` and the domain modules, so none of them forms a cycle with it, as [ADR 0001](adr/0001-ui-and-token-packages.md) records.
- A `domain` package may depend on other `domain` packages only.
- Domain modules never depend on the platform packages of another domain. They meet through the router of `core`, which lazy-loads them with `import()`, or through `domain` packages.
- A package for the whole workspace, and the end-to-end tests of an app, depend on other packages for the whole workspace only.
- Any project may also depend on the packages for the whole workspace, such as the helpers of [`@dnd-mapp/common`](../packages/common/README.md).

Two checks enforce these rules:

- **moon.** Tag each project in its `moon.yml` with the platform it runs on, such as `web` or `server`, with `domain` for a `domain` package, or with `tooling` for the root project and the packages of the whole workspace. Under `constraints.tagRelationships`, [`.moon/workspace.yml`](../.moon/workspace.yml) lets a platform project depend on projects of its own platform, `domain`, and `tooling`, and a `domain` package on `domain` and `tooling` projects. moon fails to build its project graph on any other dependency, including one on a project without a tag, so every `moon` command reports it. Add a tag to `tagRelationships` along with the first project of a new platform.
- **ESLint.** moon reads dependencies from `package.json` only, while the path aliases let a project import any module. Every preset of [`@dnd-mapp/config-eslint`](../packages/config-eslint/README.md) applies a rule that fails the `lint` task on an import that breaks the rules above, and on an import of a project that the project's `package.json` does not declare. Its README explains how the rule sorts each file.

## Modules compile from source

The `exports` of a module's `package.json` point at its TypeScript sources, so the app compiles the module in its own build and the module needs no build of its own. The TypeScript packages for the whole workspace, such as `@dnd-mapp/common`, do the same, and Node.js runs them through type stripping.

The Angular compiler skips the files that TypeScript resolves through `node_modules`, so [`tsconfig.base.json`](../tsconfig.base.json) at the root of the repository maps each module to its sources with a `paths` entry. The file holds nothing but `paths`, so a project of any platform lists it in `extends` next to its preset, as [`apps/web/tsconfig.json`](../apps/web/tsconfig.json) does. Keep `paths` out of the `tsconfig.json` of a project, since it would replace the shared map rather than add to it.

To use a package of the workspace, add it to the `dependencies` of the project, or to its `devDependencies` for tooling and test helpers:

```json
"@dnd-mapp/common": "workspace:*"
```

moon hashes the inputs of a project's own tasks only, so a change to the package would rerun none of the tasks that compile it. Add the package to the inputs of each such task, as a project input with the package's `sources` group:

```yaml
inputs:
    - project: "common"
      group: "sources"
```

## TypeScript configs

Extend a preset of [`@dnd-mapp/config-typescript`](../packages/config-typescript/README.md) from the `tsconfig.json` of a new TypeScript project, and add `@group(configs)` to the inputs of its tasks, as the package README explains. Without that group, a change to a preset reruns none of the project's tasks.

The `typecheck` task of a project checks what its build or test runner leaves unchecked:

- A package with Vitest tests checks its sources, its tests, and its config files, each with its own tsconfig: `tsconfig.lib.json`, `tsconfig.spec.json`, and `tsconfig.node.json`. Only the tests then see the Vitest globals that its `vitest.config.ts` turns on.
- An Angular project checks its config files and scripts with `tsconfig.node.json`, since `ng build` and `ng test` leave them out, and ESLint, Vitest, and Node.js load them without checking.
- Any other project checks all of its files with its `tsconfig.json`, such as the Playwright tests of `e2e/web` and the presets of `@dnd-mapp/config-eslint`, which Playwright and ESLint load without checking.

## Tasks and file groups

Name the inputs of a task through file groups rather than listing globs, so tasks that read the same files share one list and a new file reaches all of them. [`.moon/tasks/all.yml`](../.moon/tasks/all.yml) defines the groups that every project inherits, such as `configs`, and a project defines its own groups, such as `sources`, under `fileGroups` in its `moon.yml`. A project group replaces an inherited group with the same name, and the globs of every group resolve from the root of the project that uses it.

Define a task that more than one project runs once, in a file in `.moon/tasks/`, rather than in each project's `moon.yml`. The `inheritedBy` conditions of each file pick the projects that inherit its tasks: [`.moon/tasks/eslint.yml`](../.moon/tasks/eslint.yml) gives the `lint` task to every project with an `eslint.config.ts`. A project that inherits a task defines the file groups it reads, such as `sources`, and overrides or extends the task by defining one with the same id in its own `moon.yml`. To opt out, list the tasks under `workspace.inheritedTasks.exclude` in the project's `moon.yml`; the `root` project sets `include: []` to inherit none. `pnpm moon project <id>` lists every task of a project, inherited ones included.

## Adding a project

1. Create the folder that fits its kind, as [Projects](#projects) describes, and name the package after it.
2. Give its `moon.yml` a `project` block, a tag, and for a module an explicit `id`. Add the tag to `tagRelationships` when it names a new platform.
3. Declare each package of the workspace that it uses in its `package.json`, and add each to the inputs of the tasks that compile it, as [Modules compile from source](#modules-compile-from-source) describes.
4. For a module, add a `paths` entry to `tsconfig.base.json`.
5. Extend a TypeScript preset and an ESLint preset: `angular` for an Angular app or module, `playwright` for end-to-end tests, and `typescript` for any other TypeScript project.
6. Write a README that says what the project is for and lists its tasks, as the existing projects do, and add the project to the [Projects](../README.md#projects) section of the root README.
7. Add each new catalog of development tools to Renovate, as [Dependency updates](dependency-updates.md#adding-a-catalog) describes.
8. For a project that ships releases, follow [Adding a releasable project](releasing.md#adding-a-releasable-project) too.
