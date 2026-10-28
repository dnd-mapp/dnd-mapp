# ESLint config

The shared ESLint config of the projects of D&D Mapp. It enforces the dependency rules between the projects, which the [Projects, tasks, and dependencies](../../CONTRIBUTING.md#projects-tasks-and-dependencies) section of `CONTRIBUTING.md` describes, on the imports of each project.

| Task        | Command | Runs in CI | Cached |
|:------------|:--------|:----------:|:------:|
| `typecheck` | `tsc`   |    yes     |  yes   |

## Usage

Add the package to the `devDependencies` of a project:

```json
"@dnd-mapp/config-eslint": "workspace:*"
```

Add `moduleBoundaries` to the end of the project's `eslint.config.ts`, and pass it the folder of the config, which holds the project's `package.json`:

```ts
import { moduleBoundaries } from '@dnd-mapp/config-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig(
    // The other configs of the project.
    moduleBoundaries(import.meta.dirname),
);
```

## Checks

`moduleBoundaries` adds the `boundaries/dependencies` rule of [`eslint-plugin-boundaries`](https://www.jsboundaries.dev) to every TypeScript file of the project. The rule resolves each import, static or dynamic, through the path aliases in [`tsconfig.base.json`](../../tsconfig.base.json), finds the project it lands in, and fails on two kinds of import:

- An import that the dependency rules forbid, such as a module that imports the web module of another domain.
- An import of a project that the project's `package.json` does not declare, or an import of another project through a relative path. The path aliases resolve every module for every project, but moon builds its project graph from `package.json`, so it would miss such a dependency.

The rule sorts the projects by their folder, and allows each kind of project these imports:

- `apps/<platform>`: the core of its platform.
- `packages/<domain>/<slot>`: the core of its platform, the domain package of its own domain, and the domain package of core. A domain package imports other domain packages only, and the core of a platform lazy-loads the modules of that platform with `import()`.
- `packages/<name>`: none. Any project may import these packages for the whole workspace, as an ESLint config imports this one.
- `e2e/<platform>`: none.

Run ESLint with the `ESLINT_PLUGIN_BOUNDARIES_DEBUG=1` environment variable to print how the rule sorts each file and import.

Check the types of the config, which ESLint loads without checking:

```bash
pnpm moon run config-eslint:typecheck
```
