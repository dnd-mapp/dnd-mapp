import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        clearMocks: true,
        browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: 'chromium' }],
            provider: playwright(),
        },
        coverage: {
            exclude: [],
            include: ['src/**/*.ts'],
            provider: 'v8',
            reportOnFailure: true,
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
        setupFiles: [],
        sequence: {
            shuffle: true,
        },
        uiBase: '/dnd-mapp/',
    },
});
