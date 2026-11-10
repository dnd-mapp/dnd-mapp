import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test';

const isCI = Boolean(process.env['CI']);
// BASE_URL points the tests at a deployed environment, such as staging. Without it, they run against the dev server or
// the stack, which both serve the app at the URL below, which needs no hosts entry.
const deployedURL = process.env['BASE_URL'];
const baseURL = deployedURL ?? 'https://localhost:4200';

/**
 * Picks the server that the tests run against. A deployed environment is already up. With CI set, the tests run against
 * the web image behind Caddy, in the stack that global-setup.ts starts, or against a dev server that is already up.
 * Without it, they run against the dev server.
 */
function server(): Pick<PlaywrightTestConfig, 'globalSetup' | 'webServer'> {
    if (deployedURL !== undefined) {
        return {};
    }
    if (isCI) {
        return { globalSetup: './global-setup.ts' };
    }
    return {
        webServer: {
            command: 'pnpm moon run web:start',
            url: baseURL,
            // The readiness check runs in Node.js, which does not trust the mkcert CA.
            ignoreHTTPSErrors: true,
            reuseExistingServer: true,
        },
    };
}

export default defineConfig({
    testDir: './src',
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    reporter: [['dot'], ...(isCI ? [['github'] as const] : []), ['html', { open: 'never' }]],
    use: {
        baseURL,
        trace: isCI ? 'on-first-retry' : 'off',
        // Caddy serves the stack with a certificate of its own CA, which the browser does not trust. A deployed
        // environment has a public certificate, which the browser checks.
        ignoreHTTPSErrors: deployedURL === undefined,
    },
    projects: [
        {
            name: 'chromium',
            // The chromium channel runs the full Chromium build in the new headless mode, rather than the headless
            // shell, so the tests run on the browser users run.
            use: { ...devices['Desktop Chrome'], channel: 'chromium' },
        },
    ],
    ...server(),
});
