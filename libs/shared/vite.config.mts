/// <reference types="vitest" />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';
import { coverageConfigDefaults } from 'vitest/config';
import { InlineConfig } from 'vitest/node';

export default defineConfig(() => ({
    cacheDir: '../../node_modules/.vite/libs/shared',
    plugins: [nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
    root: __dirname,
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    test: {
        clearMocks: true,
        coverage: {
            enabled: true,
            exclude: [...coverageConfigDefaults.exclude, '**/index.ts', '**/public_api.ts'],
            experimentalAstAwareRemapping: true,
            include: ['**'],
            provider: 'v8' as const,
            reporter: ['text-summary', 'html'],
            reportOnFailure: true,
            reportsDirectory: '../../reports/libs/shared/coverage',
            // thresholds: {
            //     branches: 80,
            //     functions: 80,
            //     lines: 80,
            //     statements: 80,
            // }
        },
        environment: 'node',
        globals: true,
        include: ['src/**/*.spec.ts'],
        name: 'shared',
        passWithNoTests: true,
        reporters: [
            'dot',
            ['html', { outputFile: '../../reports/libs/shared/index.html' }],
        ] as InlineConfig['reporters'],
        setupFiles: [] as string[],
        sequence: {
            shuffle: true,
        },
        ui: !process.env['CI'],
    },
}));
