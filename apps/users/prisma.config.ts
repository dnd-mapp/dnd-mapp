import { config } from 'dotenv';
import { join } from 'path';
import { defineConfig } from 'prisma/config';

config({ path: [join(__dirname, '.env')] });

export default defineConfig({
    earlyAccess: true,
    schema: join(__dirname, 'prisma', 'schema.prisma'),
});
