import { execFileSync } from 'node:child_process';
import { connect } from 'node:net';
import { join } from 'node:path';

const composeArgs = ['compose', '--file', join(import.meta.dirname, 'compose.yaml')];

/** The port of the app, which the dev server and Caddy in the stack both listen on. */
const port = 4200;

/**
 * Starts the stack of compose.yaml and returns the teardown that stops it again. When a server already listens on the
 * port of the app, such as the dev server, the tests run against that server and the stack stays down.
 */
export default async function globalSetup(): Promise<(() => void) | undefined> {
    if (await listening(port)) {
        return undefined;
    }

    // No registry holds an image with the local tag, which web:image builds, so the stack must not pull it.
    const WEB_PULL_POLICY = process.env['WEB_IMAGE']?.endsWith(':local') ? 'never' : 'always';
    const env = { ...process.env, WEB_PULL_POLICY };
    const run = (...args: string[]) => execFileSync('docker', [...composeArgs, ...args], { env, stdio: 'inherit' });
    const down = () => run('down', '--volumes');

    try {
        run('up', '--wait', '--quiet-pull');
    } catch (error) {
        // A container that fails its healthcheck says why in its logs, which the stack takes with it once it stops.
        run('logs', '--no-color');
        down();
        throw error;
    }

    return down;
}

/** Tells whether a server accepts connections on the given port of the loopback address. */
function listening(port: number): Promise<boolean> {
    return new Promise((resolve) => {
        const socket = connect(port, '127.0.0.1')
            .once('connect', () => {
                socket.end();
                resolve(true);
            })
            .once('error', () => {
                resolve(false);
            });
    });
}
