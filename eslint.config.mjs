import nx from '@nx/eslint-plugin';

export default [
    ...nx.configs['flat/base'],
    ...nx.configs['flat/typescript'],
    ...nx.configs['flat/javascript'],
    {
        ignores: ['**/.angular', '**/.msw', '**/.nx', '**/dist', '**/node_modules', '**/reports', '**/.prisma/client'],
    },
    {
        files: ['**/*.ts', '**/*.js'],
        rules: {
            '@nx/enforce-module-boundaries': [
                'error',
                {
                    enforceBuildableLibDependency: true,
                    allowCircularSelfDependency: true,
                    allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
                    depConstraints: [
                        {
                            sourceTag: 'scope:client',
                            onlyDependOnLibsWithTags: ['scope:shared', 'scope:client'],
                        },
                        {
                            sourceTag: 'scope:server',
                            onlyDependOnLibsWithTags: ['scope:shared', 'scope:server'],
                        },
                        {
                            sourceTag: 'scope:e2e',
                            onlyDependOnLibsWithTags: ['scope:e2e', 'scope:shared'],
                        },
                        {
                            sourceTag: 'scope:shared',
                            onlyDependOnLibsWithTags: ['scope:shared'],
                        },
                        {
                            sourceTag: 'type:angular',
                            allowedExternalImports: ['@analogjs/*', '@angular/*', 'msw', 'msw/browser', 'rxjs'],
                        },
                        {
                            sourceTag: 'type:nest',
                            allowedExternalImports: [
                                '@nestjs/*',
                                '@dotenvx/*',
                                'class-transformer',
                                'class-validator',
                                'jest',
                                'prisma/*',
                            ],
                        },
                        {
                            sourceTag: 'type:playwright',
                            allowedExternalImports: ['@nx/*', '@playwright/*'],
                        },
                        {
                            sourceTag: 'type:jest',
                            allowedExternalImports: ['@nx/*', 'axios', 'jest'],
                        },
                    ],
                },
            ],
        },
    },
    {
        files: ['**/*.ts', '**/*.cts', '**/*.mts', '**/*.js', '**/*.cjs', '**/*.mjs'],
        rules: {},
    },
];
