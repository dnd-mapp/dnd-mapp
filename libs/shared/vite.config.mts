import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

const isCI = Boolean(process.env['CI']);

export default defineConfig(() => ({
    cacheDir: '../../node_modules/.vite/libs/shared',
    plugins: [nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
    root: __dirname,
    test: {
        environment: 'node',
        clearMocks: true,
        coverage: {
            enabled: true,
            include: ['src/lib/**/*'],
            exclude: ['**/index.ts'],
            provider: 'v8' as const,
            reporter: ['html', 'text-summary'],
            reportOnFailure: true,
            reportsDirectory: '../../reports/libs/shared/coverage',
            // thresholds: {
            //     branches: 80,
            //     functions: 80,
            //     lines: 80,
            //     statements: 80,
            // }
        },
        globals: true,
        include: ['src/**/*.spec.ts'],
        name: 'shared',
        open: false,
        outputFile: '../../reports/libs/shared/index.html',
        reporters: ['dot', 'html'],
        sequence: {
            shuffle: true,
        },
        setupFiles: ['test/setup-test.ts'],
        ui: !isCI,
        uiBase: '/shared/',
        watch: !isCI,
    },
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
}));
