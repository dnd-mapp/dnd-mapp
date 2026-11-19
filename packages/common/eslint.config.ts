import { typescript } from '@critsource/config-eslint/typescript';
import { defineConfig } from 'eslint/config';

export default defineConfig(typescript(import.meta.dirname), {
    ignores: ['coverage/'],
});
