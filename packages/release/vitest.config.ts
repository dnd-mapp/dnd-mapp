import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            enabled: true,
            // main.ts only connects the CLI to the real git, clock, and process, which the adapter tests cover.
            exclude: ['src/main.ts', 'src/testing/**'],
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
        globals: true,
        include: ['src/**/*.spec.ts'],
        reporters: ['dot'],
        sequence: {
            shuffle: true,
        },
    },
});
