import { waitForPortOpen } from '@nx/node/utils';

export default async () => {
    console.log('\nSetting up...\n');

    const host = process.env['HOST'] ?? 'localhost';
    const port = process.env['PORT'] ? Number(process.env['PORT']) : 4300;

    await waitForPortOpen(port, { host: host });
};
