import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            enabled: true,
            include: ['src/**/*.ts'],
            provider: 'v8',
            reporter: ['text-summary', 'html'],
            reportOnFailure: true,
            thresholds: {
                branches: 80,
                functions: 80,
                lines: 80,
                statements: 80,
            },
        },
        include: ['src/**/*.spec.ts'],
        reporters: ['dot'],
        sequence: {
            shuffle: true,
        },
    },
});
