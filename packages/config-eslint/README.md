# ESLint config

The shared ESLint config of the projects of D&D Mapp. Its presets hold the rules that the projects share, leave formatting to Prettier, and enforce the dependency rules between the projects on the imports of each project. The [Projects, tasks, and dependencies](../../CONTRIBUTING.md#projects-tasks-and-dependencies) section of `CONTRIBUTING.md` describes those rules.

| Task        | Command | Runs in CI | Cached |
|:------------|:--------|:----------:|:------:|
| `typecheck` | `tsc`   |    yes     |  yes   |

## Usage

Add the package to the `devDependencies` of a project, next to `eslint` and `typescript`, which it expects as peers. It brings the ESLint plugins of its presets along, so the project lists none of its own.

```json
"@dnd-mapp/config-eslint": "workspace:*"
```

Extend the preset that fits the project:

| Preset       | Import                               | Extended by                                    |
|:-------------|:-------------------------------------|:-----------------------------------------------|
| `typescript` | `@dnd-mapp/config-eslint/typescript` | A TypeScript project without a framework.      |
| `angular`    | `@dnd-mapp/config-eslint/angular`    | An Angular app or module.                      |
| `playwright` | `@dnd-mapp/config-eslint/playwright` | A project of end-to-end tests with Playwright. |

Pass the preset the folder of the project's `eslint.config.ts`, which holds the project's `package.json`, and add the options of the project after it, such as the folders that ESLint skips:

```ts
import { angular } from '@dnd-mapp/config-eslint/angular';
import { defineConfig } from 'eslint/config';

export default defineConfig(angular(import.meta.dirname), {
    ignores: ['coverage/', 'dist/'],
});
```

## Checks

Every preset applies the recommended rules of ESLint and the `strictTypeChecked` and `stylisticTypeChecked` rules of [`typescript-eslint`](https://typescript-eslint.io) to every TypeScript file of the project. The other presets add their own rules:

- `angular`: the recommended rules of [`angular-eslint`](https://github.com/angular-eslint/angular-eslint) for TypeScript files and templates, inline ones included, and its accessibility rules for templates. Selectors take the `dma` prefix, as kebab-case elements for components and camelCase attributes for directives.
- `playwright`: the recommended rules of [`eslint-plugin-playwright`](https://github.com/mskelton/eslint-plugin-playwright) for the tests in `src`.

After those rules, every preset applies [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier), which turns off the rules that conflict with Prettier, so ESLint leaves formatting to Prettier.

Last, every preset adds the `boundaries/dependencies` rule of [`eslint-plugin-boundaries`](https://www.jsboundaries.dev) to every TypeScript file of the project. The rule resolves each import, static or dynamic, through the path aliases in [`tsconfig.base.json`](../../tsconfig.base.json), finds the project it lands in, and fails on two kinds of import:

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
