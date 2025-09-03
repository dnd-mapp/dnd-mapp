const nxPreset = require('@nx/jest/preset').default;

module.exports = {
    ...nxPreset,
    clearMocks: true,
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/*.ts',
        '!<rootDir>/src/**/index.ts',
        '!<rootDir>/src/*.d.ts',
    ],
    collectCoverage: true,
    coverageReporters: ['text-summary', 'html'],
    // Don't enforce code coverage for now to speed up development.
    // coverageThreshold: {
    //     global: {
    //         branches: 80,
    //         functions: 80,
    //         lines: 80,
    //         statements: 80,
    //     },
    // },
    moduleNameMapper: {
        '@dnd-mapp/shared-api': ['libs/shared-api/src/public_api.ts'],
    },
    randomize: true,
    showSeed: true,
};
