import type { StorybookConfig } from '@storybook/angular';
import { RuleSetRule } from 'webpack';

function isResourceRule(rule: unknown): rule is RuleSetRule {
    return (
        typeof rule === 'object' && 'type' in rule && typeof rule.type === 'string' && rule.type === 'asset/resource'
    );
}

const config: StorybookConfig = {
    addons: ['@storybook/addon-docs'],
    core: {
        disableTelemetry: true,
    },
    framework: {
        name: '@storybook/angular',
        options: {},
    },
    stories: ['../**/*.mdx', '../**/*.stories.ts'],
    webpackFinal: (config) => {
        const moduleRules = config.module.rules;

        config.module.rules = moduleRules.map((rule) => {
            if (!isResourceRule(rule)) return rule;
            return {
                ...rule,
                // In order to render Angular components with SVG templates work correctly, we'll need to let
                // Storybook know that these files shouldn't be marked as asset or resource.
                test: new RegExp(rule.test.toString().replace('svg|', '')),
            };
        });
        return config;
    },
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/recipes/storybook/custom-builder-configs
