import type { Config } from 'eslint/config';
import { definePreset } from './preset.ts';

/** The ESLint config of a TypeScript project. Pass the folder of the project's ESLint config. */
export function typescript(projectRoot: string): Config[] {
    return definePreset(projectRoot);
}
