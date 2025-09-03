import nx from '@nx/eslint-plugin';

export default [
    ...nx.configs['flat/base'],
    ...nx.configs['flat/typescript'],
    ...nx.configs['flat/javascript'],
    {
        ignores: ['**/dist', '**/prisma/client', '**/.msw'],
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
                            onlyDependOnLibsWithTags: ['scope:shared', 'api:internal', 'api:public'],
                        },
                        {
                            sourceTag: 'api:internal',
                            onlyDependOnLibsWithTags: ['scope:shared', 'api:internal'],
                        },
                        {
                            sourceTag: 'scope:shared',
                            onlyDependOnLibsWithTags: ['scope:shared'],
                        },
                        {
                            sourceTag: 'scope:desktop-app',
                            onlyDependOnLibsWithTags: ['scope:shared', 'scope:desktop-app'],
                        },
                        {
                            sourceTag: 'scope:ui',
                            onlyDependOnLibsWithTags: ['scope:shared', 'scope:ui'],
                        },
                        {
                            sourceTag: 'framework:nest',
                            allowedExternalImports: [
                                '@dotenvx/dotenvx',
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
                                'nanoid',
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
                            allowedExternalImports: [
                                '@angular/*',
                                '@storybook/*',
                                'msw',
                                'msw/*',
                                'nanoid',
                                'rxjs',
                                'storybook/*',
                                'webpack',
                            ],
                        },
                        {
                            sourceTag: 'framework:electron',
                            allowedExternalImports: [
                                'chalk',
                                'class-transformer',
                                'class-validator',
                                'electron',
                                'electron-updater',
                                'electron-updater/*',
                                'nanoid',
                                'rxjs',
                                'ws',
                            ],
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
