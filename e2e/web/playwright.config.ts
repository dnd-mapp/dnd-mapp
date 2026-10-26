import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env['CI']);

export default defineConfig({
    testDir: './src',
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    reporter: [['dot'], ...(isCI ? [['github'] as const] : []), ['html', { open: 'never' }]],
    use: {
        baseURL: 'https://localhost.www.dndmapp.dev:4200',
        trace: isCI ? 'on-first-retry' : 'off',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    // TODO: Start a container of the app image when CI is set, once #51 containerizes the app. moon run skips web:start
    //  when CI is set, so web-e2e:e2e-ci cannot start the app until then.
    webServer: {
        command: 'pnpm moon run web:start',
        url: 'https://localhost.www.dndmapp.dev:4200',
        // The readiness check runs in Node.js, which does not trust the mkcert CA.
        ignoreHTTPSErrors: true,
        reuseExistingServer: !isCI,
    },
});
