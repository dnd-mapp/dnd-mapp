import { Theme, ThemeVariables } from '../theme';

export const common: Theme = {
    [ThemeVariables.FONT_FAMILY]: `'Roboto', sans-serif`,
    [ThemeVariables.FONT_SIZE]: '100%',
    [ThemeVariables.FONT_WEIGHT_NORMAL]: 400,
} as const;
