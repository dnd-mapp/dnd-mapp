import { tsdoc } from '@dnd-mapp/config-eslint/tsdoc';
import { typescript } from '@dnd-mapp/config-eslint/typescript';
import { defineConfig } from 'eslint/config';

export default defineConfig(typescript(import.meta.dirname), tsdoc(), {
    ignores: ['coverage/'],
});
