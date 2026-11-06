import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const composeArgs = ['compose', '--file', join(import.meta.dirname, 'compose.yaml')];

/**
 * Starts the stack of compose.yaml, points the tests at the Playwright server inside it, and returns the teardown that
 * stops the stack again.
 */
export default function globalSetup(): () => void {
    const env = { ...process.env, ...playwrightCore() };
    const run = (...args: string[]) => execFileSync('docker', [...composeArgs, ...args], { env, stdio: 'inherit' });
    const read = (...args: string[]) => execFileSync('docker', [...composeArgs, ...args], { env, encoding: 'utf8' });
    const down = () => run('down', '--volumes');

    try {
        run('up', '--wait', '--quiet-pull');
    } catch (error) {
        // A container that fails its healthcheck says why in its logs, which the stack takes with it once it stops.
        run('logs', '--no-color');
        down();
        throw error;
    }

    // The test fixtures connect to this endpoint rather than launch a browser on the host. The variable reaches the
    // workers, which Playwright starts after the global setup.
    process.env['PW_TEST_CONNECT_WS_ENDPOINT'] = `ws://${read('port', 'playwright', '3000').trim()}/`;

    return down;
}

/** Locates the playwright-core package of the test runner, which the Playwright server of the stack mounts. */
function playwrightCore(): { PLAYWRIGHT_CORE_DIR: string; PLAYWRIGHT_VERSION: string } {
    const resolve = (from: string, name: string) => createRequire(from).resolve(`${name}/package.json`);
    const manifest = resolve(
        resolve(resolve(import.meta.filename, '@playwright/test'), 'playwright'),
        'playwright-core',
    );
    const { version } = JSON.parse(readFileSync(manifest, 'utf8')) as { version: string };

    return { PLAYWRIGHT_CORE_DIR: dirname(manifest), PLAYWRIGHT_VERSION: version };
}
