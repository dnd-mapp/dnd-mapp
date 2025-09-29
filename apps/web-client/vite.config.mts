/// <reference types='vitest' />
/// <reference types="@vitest/browser/providers/playwright" />
import angular from '@analogjs/vite-plugin-angular';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

const isCI = Boolean(process.env['CI']);

export default defineConfig(() => ({
    cacheDir: '../../node_modules/.vite/apps/web-client',
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
            include: ['src/app/**/*'],
            exclude: ['**/index.ts', 'src/app/**/config/**/*'],
            provider: 'v8' as const,
            reporter: ['html', 'text-summary'],
            reportOnFailure: true,
            reportsDirectory: '../../reports/apps/web-client/coverage',
            // thresholds: {
            //     branches: 80,
            //     functions: 80,
            //     lines: 80,
            //     statements: 80,
            // }
        },
        globals: true,
        include: ['src/**/*.spec.ts'],
        name: 'web-client',
        open: false,
        outputFile: '../../reports/apps/web-client/index.html',
        reporters: ['hanging-process', 'dot', 'html'],
        sequence: {
            shuffle: true,
        },
        setupFiles: ['test/test-setup.ts'],
        ui: !isCI,
        uiBase: '/web-app/',
        watch: !isCI,
    },
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
}));
