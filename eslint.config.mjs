import nx from '@nx/eslint-plugin';

export default [
    ...nx.configs['flat/base'],
    ...nx.configs['flat/typescript'],
    ...nx.configs['flat/javascript'],
    {
        ignores: ['**/.angular', '**/.msw', '**/.nx', '**/dist', '**/node_modules', '**/reports'],
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
                            onlyDependOnLibsWithTags: [],
                        },
                        {
                            sourceTag: 'type:angular',
                            allowedExternalImports: ['@analogjs/*', '@angular/*', 'msw', 'msw/browser', 'rxjs'],
                        },
                        {
                            sourceTag: 'type:playwright',
                            allowedExternalImports: ['@nx/*', '@playwright/*'],
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
