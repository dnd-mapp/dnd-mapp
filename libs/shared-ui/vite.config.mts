/// <reference types='vitest' />
import angular from '@analogjs/vite-plugin-angular';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

const isCI = Boolean(process.env['CI']);

export default defineConfig(() => ({
    cacheDir: '../../node_modules/.vite/libs/shared-ui',
    plugins: [
        angular(),
        nxViteTsPaths(),
        nxCopyAssetsPlugin(['*.md', { input: '../../.msw', glob: '*', output: '.' }]),
    ],
    root: __dirname,
    test: {
        browser: {
            enabled: true,
            name: 'chromium',
            instances: [
                {
                    browser: 'chromium',
                    headless: true,
                },
            ],
            provider: 'playwright',
        },
        clearMocks: true,
        coverage: {
            enabled: true,
            exclude: ['**/index.ts'],
            include: ['src/lib/**/*'],
            provider: 'v8' as const,
            reporter: ['html', 'text-summary'],
            reportOnFailure: true,
            reportsDirectory: '../../reports/libs/shared-ui/coverage',
            // thresholds: {
            //     branches: 80,
            //     functions: 80,
            //     lines: 80,
            //     statements: 80,
            // }
        },
        globals: true,
        include: ['src/**/*.spec.ts'],
        name: 'shared-ui',
        open: false,
        outputFile: '../../reports/libs/shared-ui/index.html',
        reporters: ['dot', 'html'],
        setupFiles: ['src/test-setup.ts'],
        sequence: {
            shuffle: true,
        },
        ui: !isCI,
        uiBase: '/shared-ui/',
        watch: !isCI,
    },
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
}));
