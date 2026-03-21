import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const isCI = Boolean(process.env['CI']);

export default defineConfig({
    resolve: {
        tsconfigPaths: true,
    },
    test: {
        clearMocks: true,
        browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: 'chromium' }],
            provider: playwright(),
            screenshotFailures: false,
        },
        coverage: {
            provider: 'v8',
            reportOnFailure: true,
            reporter: ['text-summary', ['html', { subdir: '.' }]],
            reportsDirectory: 'coverage/dnd-mapp',
            thresholds: {
                branches: 80,
                functions: 80,
                lines: 80,
                statements: 80,
            },
        },
        globals: true,
        name: 'dnd-mapp',
        open: false,
        passWithNoTests: true,
        reporters: [
            ['html', { outputFile: 'reports/dnd-mapp/index.html' }],
            'dot',
            ...(isCI ? ['github-actions'] : []),
        ],
        sequence: {
            shuffle: true,
        },
        uiBase: '/dnd-mapp/',
    },
});
