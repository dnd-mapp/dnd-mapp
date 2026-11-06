import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env['CI']);
// The dev server and the stack both serve the app at this URL, which needs no hosts entry.
const baseURL = 'https://localhost:4200';

export default defineConfig({
    testDir: './src',
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    reporter: [['dot'], ...(isCI ? [['github'] as const] : []), ['html', { open: 'never' }]],
    use: {
        baseURL,
        trace: isCI ? 'on-first-retry' : 'off',
        // Caddy serves the stack with a certificate of its own CA, which the browser does not trust.
        ignoreHTTPSErrors: true,
    },
    projects: [
        {
            name: 'chromium',
            // The chromium channel runs the full Chromium build in the new headless mode, rather than the headless
            // shell, so the tests run on the browser users run.
            use: { ...devices['Desktop Chrome'], channel: 'chromium' },
        },
    ],
    // With CI set, the tests run against the web image behind Caddy, in the stack that global-setup.ts starts, or
    // against a dev server that is already up. Without it, they run against the dev server.
    ...(isCI
        ? { globalSetup: './global-setup.ts' }
        : {
              webServer: {
                  command: 'pnpm moon run web:start',
                  url: baseURL,
                  // The readiness check runs in Node.js, which does not trust the mkcert CA.
                  ignoreHTTPSErrors: true,
                  reuseExistingServer: true,
              },
          }),
});
