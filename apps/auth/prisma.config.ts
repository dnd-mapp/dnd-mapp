import { config } from '@dotenvx/dotenvx';
import { defineConfig } from 'prisma/config';

config({ path: ['apps/auth/.env', '.env'] });

export default defineConfig({
    migrations: {
        seed: './prisma/seed.ts',
    },
    schema: './prisma/schema.prisma',
});
