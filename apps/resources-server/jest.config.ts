import type { Config } from 'jest';

export default {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: '../../reports/apps/resources-server',
    coverageReporters: ['text-summary', 'html'],
    // coverageThreshold: {
    //     global: {
    //         branches: 80,
    //         functions: 80,
    //         lines: 80,
    //         statements: 80,
    //     }
    // },
    displayName: 'resources-server',
    moduleFileExtensions: ['ts', 'js'],
    moduleNameMapper: {},
    preset: '../../jest.preset.js',
    setupFilesAfterEnv: ['<rootDir>/test/setup-test.ts'],
    slowTestThreshold: 300,
    testEnvironment: 'node',
    transform: {
        '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
    },
} satisfies Config;
