import angularEslint from 'angular-eslint';
import type { Config } from 'eslint/config';
import { definePreset } from './preset.ts';

/**
 * The ESLint config of an Angular project, which adds the Angular rules to the TypeScript preset and lints the
 * templates, inline ones included. Pass the folder of the project's ESLint config.
 */
export function angular(projectRoot: string): Config[] {
    return definePreset(
        projectRoot,
        {
            files: ['**/*.ts'],
            extends: [angularEslint.configs.tsRecommended],
            // Name the processor rather than pass angularEslint.processInlineTemplates, whose type includes undefined
            // and fails exactOptionalPropertyTypes.
            plugins: { '@angular-eslint/template': angularEslint.templatePlugin },
            processor: '@angular-eslint/template/extract-inline-html',
            rules: {
                '@angular-eslint/component-selector': [
                    'error',
                    { type: 'element', prefix: 'dma', style: 'kebab-case' },
                ],
                '@angular-eslint/directive-selector': [
                    'error',
                    { type: 'attribute', prefix: 'dma', style: 'camelCase' },
                ],
                // Angular declares components, directives, and pipes as decorated classes that may have no members.
                '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
            },
        },
        {
            files: ['**/*.html'],
            extends: [angularEslint.configs.templateRecommended, angularEslint.configs.templateAccessibility],
        },
    );
}
