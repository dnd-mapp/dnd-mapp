import js from '@eslint/js';
import { type Config, defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import tseslint from 'typescript-eslint';
import { moduleBoundaries } from './module-boundaries.ts';

/**
 * Builds a preset for the project in `projectRoot`: the type-checked TypeScript rules, then the given configs, then the
 * dependency rules between the projects, which come last so no project can leave them out. In between, the Prettier
 * config turns off the rules that conflict with Prettier, after every config that could turn them on.
 */
export function definePreset(projectRoot: string, ...configs: Parameters<typeof defineConfig>): Config[] {
    return defineConfig(
        {
            files: ['**/*.ts'],
            extends: [
                js.configs.recommended,
                tseslint.configs.strictTypeChecked,
                tseslint.configs.stylisticTypeChecked,
            ],
            languageOptions: {
                parserOptions: {
                    projectService: true,
                    tsconfigRootDir: projectRoot,
                },
            },
        },
        ...configs,
        prettier,
        moduleBoundaries(projectRoot),
    );
}
