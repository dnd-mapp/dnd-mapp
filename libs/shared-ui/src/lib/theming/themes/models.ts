export const ThemeNames = {
    DARK: 'dark',
    LIGHT: 'light',
} as const;

export type ThemeName = (typeof ThemeNames)[keyof typeof ThemeNames];

export const DEFAULT_THEME: ThemeName = ThemeNames.DARK;

export function themeAttribute(value: unknown) {
    return Object.values(ThemeNames).find((theme) => theme === value) ?? DEFAULT_THEME;
}

export const ThemeVariables = {
    FONT_SIZE: 'font-size',
    FONT_FAMILY: 'font-family',

    FONT_WEIGHT_REGULAR: 'fw-regular',
    FONT_WEIGHT_BOLD: 'fw-bold',

    ICON_SIZE: 'icon-size',

    BORDER_RADIUS: 'border-radius',
    OPACITY_DISABLED: 'opacity-disabled',

    ON_BACKGROUND: 'on-background',
    BACKGROUND: 'background',

    ON_INVERSE_BACKGROUND: 'on-inverse-background',
    INVERSE_BACKGROUND: 'inverse-background',

    ON_SURFACE: 'on-surface',
    ON_SURFACE_DIM: 'on-surface-dim',
    SURFACE: 'surface',
    SURFACE_HOVER: 'surface-hover',
    SURFACE_ACTIVE: 'surface-active',

    ON_PRIMARY: 'on-primary',
    PRIMARY: 'primary',
    PRIMARY_HOVER: 'primary-hover',
    PRIMARY_ACTIVE: 'primary-active',

    ON_SUCCESS: 'on-success',
    SUCCESS: 'success',
    SUCCESS_HOVER: 'success-hover',
    SUCCESS_ACTIVE: 'success-active',

    ON_WARNING: 'on-warning',
    WARNING: 'warning',
    WARNING_HOVER: 'warning-hover',
    WARNING_ACTIVE: 'warning-active',

    ON_DANGER: 'on-danger',
    DANGER: 'danger',
    DANGER_HOVER: 'danger-hover',
    DANGER_ACTIVE: 'danger-active',
} as const;

export type ThemeVariable = (typeof ThemeVariables)[keyof typeof ThemeVariables];

export type Theme = Record<ThemeVariable, string | number>;
