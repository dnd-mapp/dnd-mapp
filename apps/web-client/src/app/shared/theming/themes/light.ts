import { Theme, ThemeVariables } from '../theme';
import { common } from './common';

export const light: Theme = {
    ...common,
    [ThemeVariables.BACKGROUND]: 'oklch(98% 0 0)',
    [ThemeVariables.ON_BACKGROUND]: 'oklch(10% 0 0)',
    [ThemeVariables.SURFACE]: 'oklch(95% 0 0)',
    [ThemeVariables.ON_SURFACE]: 'oklch(10% 0 0)',
} as const;
