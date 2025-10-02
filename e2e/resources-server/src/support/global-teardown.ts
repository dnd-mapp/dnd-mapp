import { killPort } from '@nx/node/utils';

export default async () => {
    // Put clean up logic here (e.g. stopping services, docker-compose, etc.).
    // Hint: `globalThis` is shared between setup and teardown.
    const port = process.env['PORT'] ? Number(process.env['PORT']) : 4300;

    await killPort(port);
};
