import nx from '@nx/eslint-plugin';

export default [
    ...nx.configs['flat/base'],
    ...nx.configs['flat/typescript'],
    ...nx.configs['flat/javascript'],
    {
        ignores: ['**/dist', '**/prisma/client'],
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            '@nx/enforce-module-boundaries': [
                'error',
                {
                    allowCircularSelfDependency: true,
                    enforceBuildableLibDependency: true,
                    allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
                    depConstraints: [
                        {
                            sourceTag: 'api:public',
                            onlyDependOnLibsWithTags: ['api:internal', 'scope:shared', 'framework:nest'],
                        },
                        {
                            sourceTag: 'api:internal',
                            onlyDependOnLibsWithTags: ['scope:shared', 'framework:nest'],
                        },
                        {
                            sourceTag: 'scope:shared',
                            onlyDependOnLibsWithTags: ['scope:shared'],
                        },
                        {
                            sourceTag: 'scope:desktop-app',
                            onlyDependOnLibsWithTags: ['scope:shared'],
                        },
                        {
                            sourceTag: 'scope:ui',
                            onlyDependOnLibsWithTags: ['scope:shared'],
                        },
                        {
                            sourceTag: 'framework:nest',
                            allowedExternalImports: [
                                '@fastify/cookie',
                                '@prisma',
                                '@prisma/*',
                                '@grpc/*',
                                '@nestjs/*',
                                'bcryptjs',
                                'class-transformer',
                                'class-validator',
                                'dotenv',
                                'dotenv/*',
                                'fastify',
                                'grpc-health-check',
                                'jest',
                                'juice',
                                'node-jose',
                                'nodemailer',
                                'nodemailer/*',
                                'prisma',
                                'prisma/*',
                                'rxjs',
                            ],
                        },
                        {
                            sourceTag: 'framework:angular',
                            allowedExternalImports: ['@angular/*'],
                        },
                    ],
                },
            ],
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
        // Override or add rules here
        rules: {
            '@typescript-eslint/no-unused-vars': 'off', // Let the TypeScript compiler handle unused variable errors/warnings.
        },
    },
];
