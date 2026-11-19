import { playwright } from '@critsource/config-eslint/playwright';
import { defineConfig } from 'eslint/config';

export default defineConfig(playwright(import.meta.dirname), {
    ignores: ['playwright-report/', 'test-results/'],
});
