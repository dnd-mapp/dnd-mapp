# 0004. Apps compile the modules they import from source

- **Status:** Accepted
- **Date:** 2026-10-28
- **Built in:** [#76](https://github.com/dnd-mapp/dnd-mapp/pull/76)

## Context

The web app splits into modules, such as `core-web` and `ui-web`, and uses TypeScript packages for the whole workspace, such as `@dnd-mapp/common`. None of them goes to npm; each exists only to be part of an app or a tool of the workspace. Each module could build to a `dist` that the app imports, or the app could compile the module's sources in its own build.

## Decision

The `exports` of each module's `package.json` point at its TypeScript sources, and the app compiles them in its own build, as [Modules compile from source](../architecture.md#modules-compile-from-source) describes. The Angular compiler skips the files that TypeScript resolves through `node_modules`, so `tsconfig.base.json` maps each module to its sources with a `paths` entry. Each project still declares the modules it uses as `workspace:*` dependencies, so moon and ESLint see them.

The reasons:

- Nothing goes to npm, so a `dist` would serve no one.
- Modules need no build step and no build order.
- Go to Definition lands on the source, not on a declaration file.

## Alternatives

- **A build per library, with ng-packagr or `tsc`.** Each module would need a build task, and every task that compiles an app would wait for the builds of its modules. Go to Definition would land on the built declarations.
- **TypeScript project references.** Angular doesn't support them, as [angular/angular#37276](https://github.com/angular/angular/issues/37276) tracks.
- **A custom export condition**, such as one that points at the sources while the default points at a build. It fits a package that also ships a build, and none of these does.
- **`paths` without workspace dependencies.** The code would compile, but moon builds its project graph from `package.json`, so it would see none of the dependencies, nor check them against the [dependency rules](0003-moon-tasks-and-dependency-rules.md).

## Consequences

- This goes against Angular's advice for libraries, whose [guide](https://angular.dev/tools/libraries/creating-libraries) has `paths` point at the built output rather than the sources.
- Each app compiles and type-checks every module it imports again.
- moon sees a change to a module only through the inputs that each consuming task lists by hand, as a project input with the module's `sources` group.
- The packages that Node.js runs through [type stripping](https://nodejs.org/api/typescript.html) must use erasable syntax only, so no enums, namespaces with runtime code, or parameter properties.

## Revisit when

- A package goes to npm. A custom export condition fits then.
- Type checks or CI time become a bottleneck.
- Angular supports project references.
