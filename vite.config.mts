/// <reference types='vitest' />
import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        projects: ['{apps,libs}/*/vite.config.mts'],
    },
});
