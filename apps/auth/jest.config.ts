import { readFile } from 'fs/promises';
import type { Config } from 'jest';

export default async () => {
    // Reading the SWC compilation config for the spec files
    const swcJestConfig = JSON.parse(await readFile(`${__dirname}/.spec.swcrc`, 'utf-8'));

    // Disable .swcrc look-up by SWC core because we're passing in swcJestConfig ourselves
    swcJestConfig.swcrc = false;

    return {
        coverageDirectory: '../../reports/apps/auth',
        displayName: '@dnd-mapp/auth',
        globalSetup: '<rootDir>/test/global-setup.ts',
        globalTeardown: '<rootDir>/test/global-teardown.ts',
        moduleFileExtensions: ['ts', 'js'],
        preset: '../../jest.preset.js',
        setupFilesAfterEnv: ['<rootDir>/test/test-setup.ts'],
        testEnvironment: 'node',
        transform: {
            '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
        },
    } satisfies Config;
};
