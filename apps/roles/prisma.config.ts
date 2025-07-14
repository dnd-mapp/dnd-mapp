import 'dotenv/config';
import { join } from 'path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
    earlyAccess: true,
    schema: join(__dirname, 'prisma', 'schema.prisma'),
});
