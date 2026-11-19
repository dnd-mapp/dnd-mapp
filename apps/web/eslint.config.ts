import { angular } from '@critsource/config-eslint/angular';
import { defineConfig } from 'eslint/config';

export default defineConfig(angular(import.meta.dirname), {
    ignores: ['coverage/', 'dist/'],
});
