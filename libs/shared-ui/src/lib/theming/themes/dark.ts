import { Theme, ThemeVariables } from '../theme';
import { common } from './common';

export const dark: Theme = {
    ...common,
    [ThemeVariables.BACKGROUND]: 'oklch(20% 0 0)',
    [ThemeVariables.ON_BACKGROUND]: 'oklch(95% 0 0)',
    [ThemeVariables.SURFACE]: 'oklch(25% 0 0)',
    [ThemeVariables.ON_SURFACE]: 'oklch(92% 0 0)',
    [ThemeVariables.DANGER]: 'oklch(66% 0.186 23.361)',
    [ThemeVariables.ON_DANGER]: 'oklch(95% 0 0)',
} as const;
