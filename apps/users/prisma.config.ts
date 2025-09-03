import { config } from '@dotenvx/dotenvx';
import { join } from 'path';
import { defineConfig } from 'prisma/config';

config({ path: [join(__dirname, '../../.env'), join(__dirname, '.env')] });

export default defineConfig({
    schema: join(__dirname, 'prisma', 'schema.prisma'),
});
