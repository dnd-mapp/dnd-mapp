import type { Config } from 'eslint/config';
import playwrightPlugin from 'eslint-plugin-playwright';
import { definePreset } from './preset.ts';

/**
 * The ESLint config of a Playwright project, which adds the Playwright rules to the TypeScript preset for the tests in
 * `src`. Pass the folder of the project's ESLint config.
 */
export function playwright(projectRoot: string): Config[] {
    return definePreset(projectRoot, {
        files: ['src/**/*.ts'],
        extends: [playwrightPlugin.configs['flat/recommended']],
    });
}
