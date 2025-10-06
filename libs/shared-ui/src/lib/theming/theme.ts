export const ThemeNames = {
    LIGHT: 'light',
    DARK: 'dark',
} as const;

export type ThemeName = (typeof ThemeNames)[keyof typeof ThemeNames];

export const DEFAULT_THEME: ThemeName = ThemeNames.LIGHT;

export function themeAttribute(value: unknown) {
    return Object.values(ThemeNames).find((theme) => theme === value) ?? DEFAULT_THEME;
}

export const ThemeVariables = {
    FONT_FAMILY: 'font-family',
    FONT_SIZE: 'font-size',
    FONT_WEIGHT_NORMAL: 'fw-normal',
    FONT_WEIGHT_BOLD: 'fw-bold',
    HOVER_LIGHTNESS_MODIFIER: 'hover-lightness-mod',
    ACTIVE_LIGHTNESS_MODIFIER: 'active-lightness-mod',
    BACKGROUND: 'background',
    ON_BACKGROUND: 'on-background',
    SURFACE: 'surface',
    ON_SURFACE: 'on-surface',
    PRIMARY: 'primary',
    ON_PRIMARY: 'on-primary',
    DANGER: 'danger',
    ON_DANGER: 'on-danger',
    BORDER: 'border',
} as const;

export type ThemeVariable = (typeof ThemeVariables)[keyof typeof ThemeVariables];

type ThemeVariableType = string | number;

export type Theme = { [key in ThemeVariable]?: ThemeVariableType };

export type Themes = { [key in ThemeName]?: Theme };
