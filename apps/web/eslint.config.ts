import { moduleBoundaries } from '@dnd-mapp/config-eslint';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import angular from 'angular-eslint';
import tseslint from 'typescript-eslint';

export default defineConfig(
    {
        ignores: ['coverage/', 'dist/'],
    },
    {
        files: ['**/*.ts'],
        extends: [
            js.configs.recommended,
            tseslint.configs.strictTypeChecked,
            tseslint.configs.stylisticTypeChecked,
            angular.configs.tsRecommended,
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        // Name the processor rather than pass angular.processInlineTemplates, whose type includes undefined and fails
        // exactOptionalPropertyTypes.
        plugins: { '@angular-eslint/template': angular.templatePlugin },
        processor: '@angular-eslint/template/extract-inline-html',
        rules: {
            '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'dma', style: 'kebab-case' }],
            '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'dma', style: 'camelCase' }],
            // Angular declares components, directives, and pipes as decorated classes that may have no members.
            '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
        },
    },
    {
        files: ['**/*.html'],
        extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    },
    moduleBoundaries(import.meta.dirname),
);
