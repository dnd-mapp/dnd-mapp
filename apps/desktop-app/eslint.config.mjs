import baseConfig from '../../eslint.config.mjs';

export default [
    ...baseConfig,
    {
        files: ['**/*.ts', '**/*.js', '**/*.mjs'],
        rules: {
            '@typescript-eslint/no-empty-function': 'off',
        },
    },
];
