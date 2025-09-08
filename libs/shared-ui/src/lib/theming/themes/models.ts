export const ThemeNames = {
    DARK: 'dark',
    LIGHT: 'light',
} as const;

export type ThemeName = (typeof ThemeNames)[keyof typeof ThemeNames];

export const DEFAULT_THEME: ThemeName = ThemeNames.LIGHT;

export function themeAttribute(value: unknown) {
    return Object.values(ThemeNames).find((theme) => theme === value) ?? DEFAULT_THEME;
}

export const ThemeVariables = {
    // typography
    FONT_SIZE: 'font-size',
    FONT_FAMILY: 'font-family',
    FONT_WEIGHT_REGULAR: 'font-weight-regular',
    FONT_WEIGHT_BOLD: 'font-weight-bold',

    // shape
    EXTRA_SMALL_CORNER: 'extra-small-corner',
    SMALL_CORNER: 'small-corner',
    MEDIUM_CORNER: 'medium-corner',
    LARGE_CORNER: 'large-corner',
    LARGE_INCREASED_CORNER: 'large-increased-corner',
    EXTRA_LARGE_CORNER: 'extra-large-corner',
    EXTRA_LARGE_INCREASED_CORNER: 'extra-large-increased-corner',
    EXTRA_EXTRA_LARGE_CORNER: 'extra-extra-large-corner',
    FULL_CORNER: 'full-corner',

    // colors
    PRIMARY: 'primary',
    ON_PRIMARY: 'on-primary',
    PRIMARY_CONTAINER: 'primary-container',
    ON_PRIMARY_CONTAINER: 'on-primary-container',
    PRIMARY_FIXED: 'primary-fixed',
    ON_PRIMARY_FIXED: 'on-primary-fixed',
    PRIMARY_FIXED_DIM: 'primary-fixed-dim',
    PRIMARY_FIXED_VARIANT: 'on-primary-fixed-variant',
    INVERSE_PRIMARY: 'inverse-primary',

    SECONDARY: 'secondary',
    ON_SECONDARY: 'on-secondary',
    SECONDARY_CONTAINER: 'secondary-container',
    ON_SECONDARY_CONTAINER: 'on-secondary-container',
    SECONDARY_FIXED: 'secondary-fixed',
    ON_SECONDARY_FIXED: 'on-secondary-fixed',
    SECONDARY_FIXED_DIM: 'secondary-fixed-dim',
    SECONDARY_FIXED_VARIANT: 'secondary-fixed-variant',

    TERTIARY: 'tertiary',
    ON_TERTIARY: 'on-tertiary',
    TERTIARY_CONTAINER: 'tertiary-container',
    ON_TERTIARY_CONTAINER: 'on-tertiary-container',
    TERTIARY_FIXED: 'tertiary-fixed',
    ON_TERTIARY_FIXED: 'on-tertiary-fixed',
    TERTIARY_FIXED_DIM: 'tertiary-fixed-dim',
    TERTIARY_FIXED_VARIANT: 'tertiary-fixed-variant',

    ERROR: 'error',
    ON_ERROR: 'on-error',
    ERROR_CONTAINER: 'error-container',
    ON_ERROR_CONTAINER: 'on-error-container',

    OUTLINE: 'outline',
    OUTLINE_VARIANT: 'outline-variant',

    SURFACE: 'surface',
    ON_SURFACE: 'on-surface',
    SURFACE_VARIANT: 'surface-variant',
    ON_SURFACE_VARIANT: 'on-surface-variant',
    INVERSE_SURFACE: 'inverse-surface',
    ON_INVERSE_SURFACE: 'on-inverse-surface',
    SURFACE_CONTAINER_HIGHEST: 'surface-container-highest',
    SURFACE_CONTAINER_HIGH: 'surface-container-high',
    SURFACE_CONTAINER: 'surface-container',
    SURFACE_CONTAINER_LOW: 'surface-container-low',
    SURFACE_CONTAINER_LOWEST: 'surface-container-lowest',
    SURFACE_BRIGHT: 'surface-bright',
    SURFACE_DIM: 'surface-dim',
    BACKGROUND: 'background',
    ON_BACKGROUND: 'on-background',
    SCRIM: 'scrim',
    SHADOW: 'shadow',
} as const;

export type ThemeVariable = (typeof ThemeVariables)[keyof typeof ThemeVariables];

export type Theme = Record<ThemeVariable, string | number>;
