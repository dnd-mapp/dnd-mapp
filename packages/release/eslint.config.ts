import { tsdoc } from '@critsource/config-eslint/tsdoc';
import { typescript } from '@critsource/config-eslint/typescript';
import { defineConfig } from 'eslint/config';

export default defineConfig(typescript(import.meta.dirname), tsdoc(), {
    ignores: ['coverage/'],
});
