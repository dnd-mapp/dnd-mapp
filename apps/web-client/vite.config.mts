/// <reference types='vitest' />
import angular from '@analogjs/vite-plugin-angular';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/web-client',
    plugins: [angular(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    test: {
        name: 'web-client',
        watch: false,
        globals: true,
        environment: 'jsdom',
        include: ['src/**/*.spec.ts'],
        setupFiles: ['test/test-setup.ts'],
        reporters: ['default'],
        coverage: {
            reportsDirectory: '../../reports/apps/web-client',
            provider: 'v8' as const,
        },
    },
}));
