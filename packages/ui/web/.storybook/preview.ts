import '@dnd-mapp/design-tokens/tokens.css';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/angular-vite';

export default {
    decorators: [
        // Sets data-theme on <html>, as the Theme picker of the app does, so a story shows the Dark or Light tokens.
        // The viewport control switches Mobile and Desktop.
        withThemeByDataAttribute({
            themes: { Dark: 'dark', Light: 'light' },
            defaultTheme: 'Dark',
        }),
    ],
} satisfies Preview;
