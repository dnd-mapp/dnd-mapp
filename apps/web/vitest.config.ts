import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
    resolve: {
        tsconfigPaths: true,
    },
    test: {
        api: {
            port: 4300,
        },
        browser: {
            provider: playwright(),
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
    },
});
