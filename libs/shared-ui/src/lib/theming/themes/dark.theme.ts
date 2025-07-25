import { BaseTheme } from './base.theme';
import { Theme, ThemeVariables } from './models';

export const DarkTheme: Theme = {
    ...BaseTheme,

    [ThemeVariables.ON_BACKGROUND]: 'oklch(100.0% 0.000 89.9)',
    [ThemeVariables.BACKGROUND]: 'oklch(22.5% 0.000 89.9)',

    [ThemeVariables.ON_INVERSE_BACKGROUND]: 'oklch(22.5% 0.000 89.9)',
    [ThemeVariables.INVERSE_BACKGROUND]: 'oklch(100.0% 0.000 89.9)',

    [ThemeVariables.ON_SURFACE]: 'oklch(100.0% 0.000 89.9)',
    [ThemeVariables.ON_SURFACE_DIM]: 'oklch(100.0% 0.000 89.9)',
    [ThemeVariables.SURFACE]: 'oklch(37.5% 0.000 89.9)',
    [ThemeVariables.SURFACE_HOVER]: `oklch(from var(--${ThemeVariables.SURFACE}) calc(l * 0.95) c h)`,
    [ThemeVariables.SURFACE_ACTIVE]: `oklch(from var(--${ThemeVariables.SURFACE}) calc(l * 0.90) c h)`,

    [ThemeVariables.ON_PRIMARY]: 'oklch(100.0% 0.000 89.9)',
    [ThemeVariables.PRIMARY]: 'oklch(67.7% 0.313 264.1)',
    [ThemeVariables.PRIMARY_HOVER]: `oklch(from var(--${ThemeVariables.PRIMARY}) calc(l * 0.95) c h)`,
    [ThemeVariables.PRIMARY_ACTIVE]: `oklch(from var(--${ThemeVariables.PRIMARY}) calc(l * 0.90) c h)`,

    [ThemeVariables.ON_SUCCESS]: 'oklch(100.0% 0.000 89.9)',
    [ThemeVariables.SUCCESS]: 'oklch(79.1% 0.295 142.5)',
    [ThemeVariables.SUCCESS_HOVER]: `oklch(from var(--${ThemeVariables.SUCCESS}) calc(l * 0.95) c h)`,
    [ThemeVariables.SUCCESS_ACTIVE]: `oklch(from var(--${ThemeVariables.SUCCESS}) calc(l * 0.90) c h)`,

    [ThemeVariables.ON_WARNING]: 'oklch(100.0% 0.000 89.9)',
    [ThemeVariables.WARNING]: 'oklch(79.3% 0.171 70.7)',
    [ThemeVariables.WARNING_HOVER]: `oklch(from var(--${ThemeVariables.WARNING}) calc(l * 0.95) c h)`,
    [ThemeVariables.WARNING_ACTIVE]: `oklch(from var(--${ThemeVariables.WARNING}) calc(l * 0.90) c h)`,

    [ThemeVariables.ON_DANGER]: 'oklch(100.0% 0.000 89.9)',
    [ThemeVariables.DANGER]: 'oklch(62.8% 0.258 29.2)',
    [ThemeVariables.DANGER_HOVER]: `oklch(from var(--${ThemeVariables.DANGER}) calc(l * 0.95) c h)`,
    [ThemeVariables.DANGER_ACTIVE]: `oklch(from var(--${ThemeVariables.DANGER}) calc(l * 0.90) c h)`,
};
