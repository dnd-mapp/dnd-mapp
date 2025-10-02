import { config } from '@dotenvx/dotenvx';
import { join } from 'path';
import { defineConfig } from 'prisma/config';

const isProduction = process.env['NODE_ENV'] === 'production';
const isCI = Boolean(process.env['CI']);

config({
    path: [join(__dirname, '.env'), join(__dirname, '../../.env')],
    quiet: isProduction || isCI,
    ...(isProduction || isCI ? { ignore: ['MISSING_ENV_FILE'] } : {}),
});

export default defineConfig({
    schema: join(__dirname, '.prisma/schema.prisma'),
});
