import { readFile } from 'fs/promises';
import { Config } from 'jest';
import { cwd } from 'process';

export default async () => {
    // Reading the SWC compilation config for the spec files
    const swcJestConfig = JSON.parse(await readFile(`${cwd()}/apps/users/.spec.swcrc`, 'utf-8'));

    // Disable .swcrc look-up by SWC core because we're passing in swcJestConfig ourselves
    swcJestConfig.swcrc = false;

    return {
        coverageDirectory: '../../reports/apps/users',
        displayName: 'users',
        moduleFileExtensions: ['ts', 'js'],
        preset: '../../jest.preset.js',
        testEnvironment: 'node',
        transform: {
            '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
        },
    } satisfies Config;
};
