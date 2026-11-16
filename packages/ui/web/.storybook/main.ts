import type { StorybookConfig } from '@storybook/angular-vite';

// Every build asks search engines to leave its pages out of their results, so the previews of pull requests never show
// up there. Only the Storybook of main opts out, through INDEX_STORYBOOK, as ADR 0012 explains. The name lacks the
// STORYBOOK_ prefix, since Storybook embeds such variables in the browser bundle.
const robots = process.env['INDEX_STORYBOOK'] === 'true' ? '' : '<meta name="robots" content="noindex">';

function addRobots(head = '') {
    return `${head}${robots}`;
}

export default {
    addons: ['@storybook/addon-docs', '@storybook/addon-themes', 'storybook-addon-pseudo-states'],
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
    managerHead: addRobots,
    previewHead: addRobots,
    stories: ['../src/**/*.mdx', '../src/**/*.stories.ts'],
} satisfies StorybookConfig;
