export default {
    coverageDirectory: '../../reports/apps/message-broker',
    displayName: '@dnd-mapp/message-broker',
    preset: '../../jest.preset.js',
    testEnvironment: 'node',
    transform: {
        '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
    },
    moduleFileExtensions: ['ts', 'js'],
};
