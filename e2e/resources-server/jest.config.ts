import type { Config } from 'jest';

export default {
    clearMocks: true,
    displayName: 'resources-server-e2e',
    globalSetup: '<rootDir>/src/support/global-setup.ts',
    globalTeardown: '<rootDir>/src/support/global-teardown.ts',
    moduleFileExtensions: ['ts', 'js'],
    moduleNameMapper: {},
    preset: '../../jest.preset.js',
    setupFiles: ['<rootDir>/src/support/test-setup.ts'],
    slowTestThreshold: 300,
    testEnvironment: 'node',
    transform: {
        '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
    },
} satisfies Config;
