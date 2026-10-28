# TypeScript config

The TypeScript config presets that the projects of D&D Mapp extend, so each `tsconfig.json` sets only the options specific to its project. The package has no tasks.

| Preset                         | Extends                  | For                                                                                                                                                                   |
|:-------------------------------|:-------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`base.json`](base.json)       |                          | The strict compiler options and the `es2025` target and lib.                                                                                                          |
| [`angular.json`](angular.json) | [`base.json`](base.json) | Angular apps: adds the DOM lib, decorators, and the strict options of the Angular compiler.                                                                           |
| [`node.json`](node.json)       | [`base.json`](base.json) | Code that runs in Node.js, such as config files and Playwright tests: adds the Node.js types and allows the `.ts` extension in relative imports, as Node.js requires. |

Add the package to the `devDependencies` of a project:

```json
"@dnd-mapp/config-typescript": "workspace:*"
```

Extend a preset from the project's `tsconfig.json`, and keep only the options of the project itself, such as `include` and `noEmit`:

```json
{
    "extends": "@dnd-mapp/config-typescript/node.json",
    "include": ["src/**/*.ts"],
    "compilerOptions": {
        "noEmit": true
    }
}
```

A change in this package affects no task of the projects that extend it, because moon tracks the files of each project for its own tasks only. The `configs` file group in [`.moon/tasks/all.yml`](../../.moon/tasks/all.yml) lists the presets, so add the group to the inputs of the project's tasks in its `moon.yml`, as [`apps/web/moon.yml`](../../apps/web/moon.yml) does:

```yaml
inputs:
    - "@group(configs)"
```
