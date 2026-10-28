import { moduleBoundaries } from '@dnd-mapp/config-eslint';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

export default defineConfig(
    {
        ignores: ['playwright-report/', 'test-results/'],
    },
    {
        files: ['**/*.ts'],
        extends: [js.configs.recommended, tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ['src/**/*.ts'],
        extends: [playwright.configs['flat/recommended']],
    },
    moduleBoundaries(import.meta.dirname),
);
