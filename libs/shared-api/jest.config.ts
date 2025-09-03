import { readFile } from 'fs/promises';
import { cwd } from 'process';

export default async () => {
    // Reading the SWC compilation config for the spec files
    const swcJestConfig = JSON.parse(await readFile(`${cwd()}/libs/shared-api/.spec.swcrc`, 'utf-8'));

    // Disable .swcrc look-up by SWC core because we're passing in swcJestConfig ourselves
    swcJestConfig.swcrc = false;

    return {
        displayName: 'shared-api',
        preset: '../../jest.preset.js',
        testEnvironment: 'node',
        transform: {
            '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
        },
        moduleFileExtensions: ['ts', 'js'],
        coverageDirectory: '../../reports/libs/shared-api',
    };
};
