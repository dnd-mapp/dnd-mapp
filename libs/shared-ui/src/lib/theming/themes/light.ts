import { Theme, ThemeVariables } from '../theme';
import { common } from './common';

export const light: Theme = {
    ...common,
    [ThemeVariables.HOVER_LIGHTNESS_MODIFIER]: 0.05,
    [ThemeVariables.ACTIVE_LIGHTNESS_MODIFIER]: 0.1,
    [ThemeVariables.BACKGROUND]: 'oklch(98% 0 0)',
    [ThemeVariables.ON_BACKGROUND]: 'oklch(10% 0 0)',
    [ThemeVariables.SURFACE]: 'oklch(95% 0 0)',
    [ThemeVariables.ON_SURFACE]: 'oklch(10% 0 0)',
    [ThemeVariables.PRIMARY]: 'oklch(0.65 0.140 245)',
    [ThemeVariables.ON_PRIMARY]: 'oklch(98% 0 0)',
    [ThemeVariables.DANGER]: 'oklch(55% 0.206 27.272)',
    [ThemeVariables.ON_DANGER]: 'oklch(95% 0 0)',
    [ThemeVariables.BORDER]: 'oklch(80% 0 0)',
} as const;
