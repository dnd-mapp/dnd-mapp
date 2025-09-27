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
    BACKGROUND: 'background',
    ON_BACKGROUND: 'on-background',
    SURFACE: 'surface',
    ON_SURFACE: 'on-surface',
} as const;

export type ThemeVariable = (typeof ThemeVariables)[keyof typeof ThemeVariables];

type ThemeVariableType = string | number;

export type Theme = { [key in ThemeVariable]?: ThemeVariableType };

export type Themes = { [key in ThemeName]?: Theme };
