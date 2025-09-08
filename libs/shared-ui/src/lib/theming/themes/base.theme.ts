import { Theme, ThemeVariables } from './models';

export const BaseTheme = {
    [ThemeVariables.FONT_FAMILY]: `'Roboto', sans-serif`,
    [ThemeVariables.FONT_SIZE]: '100%',
    [ThemeVariables.FONT_WEIGHT_REGULAR]: 400,
    [ThemeVariables.FONT_WEIGHT_BOLD]: 600,
} as Theme;
