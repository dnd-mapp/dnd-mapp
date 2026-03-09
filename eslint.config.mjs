import eslint from '@eslint/js';
import angular from 'angular-eslint';
import eslintConfigPrettierFlat from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
    globalIgnores(['.angular/', 'coverage/', 'dist/', 'node_modules/', 'reports/']),
    eslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
    },
    {
        files: ['**/*.ts', '**/*.mts', '**/*.cts'],
        extends: [
            tseslint.configs.recommendedTypeChecked,
            tseslint.configs.stylisticTypeChecked,
            angular.configs.tsRecommended,
        ],
        processor: angular.processInlineTemplates,
        rules: {
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'dma',
                    style: 'camelCase',
                },
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'dma',
                    style: 'kebab-case',
                },
            ],
        },
    },
    {
        files: ['**/*.html'],
        extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
        rules: {},
    },
    eslintConfigPrettierFlat,
]);
