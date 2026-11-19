# TypeScript config

The TypeScript config presets that the projects of D&D Mapp extend, so each `tsconfig.json` sets only the options specific to its project. The package has no tasks.

## Using the package

Add the package to the `devDependencies` of a project:

```json
"@critsource/config-typescript": "workspace:*"
```

Extend a preset from the project's `tsconfig.json`. An Angular app or module also extends [`tsconfig.base.json`](../../tsconfig.base.json), which maps each module to its sources, as [Architecture](../../docs/architecture.md#modules-compile-from-source) explains. The `tsconfig.json` of an Angular module in `packages/<domain>/web` extends both, and references a tsconfig for each kind of file:

```json
{
    "extends": ["@critsource/config-typescript/angular.json", "../../../tsconfig.base.json"],
    "references": [
        { "path": "./tsconfig.lib.json" },
        { "path": "./tsconfig.spec.json" },
        { "path": "./tsconfig.node.json" }
    ],
    "files": []
}
```

[Architecture](../../docs/architecture.md#typescript-configs) describes the split into `tsconfig.lib.json`, `tsconfig.spec.json`, and `tsconfig.node.json`, and which projects use it. Each of them extends `./tsconfig.json` and adds its own `include`, except the `tsconfig.node.json` of an Angular project, which extends `node.json`, since its config files run in Node.js. A project that runs in Node.js extends `node.json` alone, as [`packages/common/tsconfig.json`](../common/tsconfig.json) does.

A change in this package affects no task of the projects that extend it, because moon tracks the files of each project for its own tasks only. The `configs` file group in [`.moon/tasks/all.yml`](../../.moon/tasks/all.yml) lists the presets, so add the group to the inputs of the project's tasks in its `moon.yml`, as [`apps/web/moon.yml`](../../apps/web/moon.yml) does:

```yaml
inputs:
    - "@group(configs)"
```

## Presets

| Preset                         | Extends                  | For                                                                                                                                                                                                                               |
|:-------------------------------|:-------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`base.json`](base.json)       |                          | The strict compiler options and the `es2025` target and lib.                                                                                                                                                                      |
| [`angular.json`](angular.json) | [`base.json`](base.json) | Angular apps and modules, such as `web`, `core-web`, and `ui-web`: adds the DOM lib, decorators, the strict options of the Angular compiler, and the `.ts` extension in relative imports, which `@critsource/common` uses.        |
| [`node.json`](node.json)       | [`base.json`](base.json) | Code that runs in Node.js, such as the packages for the whole workspace, end-to-end tests, and the config files of every project: adds the Node.js types and allows the `.ts` extension in relative imports, as Node.js requires. |

### Options that shape the code

Next to `strict`, `base.json` turns on options that change how the code is written, not only what the compiler reports:

- `module: "preserve"` leaves each `import` and `export` as written, for the bundler or Node.js to load, and resolves imports the way a bundler does, through the `exports` of each package.
- `verbatimModuleSyntax` keeps every import without a `type` modifier, so import a type with `import type` or an inline `type`, as in `import { type Config, defineConfig } from 'eslint/config'`. Node.js strips types without knowing which imports are types, so it fails on a type imported without the modifier.
- `exactOptionalPropertyTypes` keeps `undefined` out of an optional property unless its type lists it: leave the property out, or declare it as `name?: string | undefined`.
- `noUncheckedIndexedAccess` adds `undefined` to the type of each element read by index, from an array or an index signature, so check the element before you use it.
- `noPropertyAccessFromIndexSignature` makes code read a key of an index signature with brackets, as in `process.env['CI']`, so a dot always names a declared property.
