import { readFile } from 'fs/promises';
import { Config } from 'jest';

export default async () => {
    // Reading the SWC compilation config for the spec files
    const swcJestConfig = JSON.parse(await readFile(`${__dirname}/.spec.swcrc`, 'utf-8'));

    // Disable .swcrc look-up by SWC core because we're passing in swcJestConfig ourselves
    swcJestConfig.swcrc = false;

    return {
        coverageDirectory: '../../reports/users',
        displayName: '@dnd-mapp/dma-users',
        moduleFileExtensions: ['ts', 'js'],
        preset: '../../jest.preset.js',
        testEnvironment: 'node',
        transform: {
            '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
        },
    } satisfies Config;
};
