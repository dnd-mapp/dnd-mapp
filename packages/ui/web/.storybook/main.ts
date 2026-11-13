import type { StorybookConfig } from '@storybook/angular-vite';

export default {
    addons: ['@storybook/addon-docs', '@storybook/addon-themes'],
    core: {
        disableTelemetry: true,
        disableWhatsNewNotifications: true,
    },
    framework: {
        name: '@storybook/angular-vite',
        options: {
            tsconfig: 'tsconfig.storybook.json',
        },
    },
    stories: ['../src/**/*.mdx', '../src/**/*.stories.ts'],
} satisfies StorybookConfig;
