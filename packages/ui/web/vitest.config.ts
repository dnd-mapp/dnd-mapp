import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
    test: {
        api: {
            port: 4301,
        },
        // The browser is set up here rather than through the browsers option of the unit-test builder, which
        // replaces this provider with one of its own and so drops its launch options.
        browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: 'chromium' }],
            // The chromium channel runs the full Chromium build in the new headless mode, rather than the headless
            // shell, so the tests run on the browser users run.
            provider: playwright({
                contextOptions: {
                    // Runs every test in Dark, the theme that tokens.css applies without a media query, rather than
                    // following the system's prefers-color-scheme, so the colors that a test expects match on every
                    // machine.
                    colorScheme: 'dark',
                },
                launchOptions: {
                    channel: 'chromium',
                },
            }),
            screenshotFailures: false,
        },
        coverage: {
            provider: 'v8',
            reportOnFailure: true,
        },
        globals: true,
        open: false,
        sequence: {
            shuffle: true,
        },
        // Loads tokens.css into the test page, since the unit-test builder takes no styles from the ng-packagr build
        // target that the tests build from. Vite injects the CSS that a setup file imports into the page.
        setupFiles: ['@critsource/design-tokens/tokens.css'],
    },
});
