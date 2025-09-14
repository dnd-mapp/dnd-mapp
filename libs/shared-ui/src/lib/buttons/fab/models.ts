export const FabSizes = {
    BASE: 'base',
    MEDIUM: 'medium',
    LARGE: 'large',
} as const;

export type FabSize = (typeof FabSizes)[keyof typeof FabSizes];

export const DEFAULT_FAB_SIZE: FabSize = FabSizes.BASE;

export function fabSizeAttribute(value: unknown) {
    return Object.values(FabSizes).find((size) => size === value) ?? DEFAULT_FAB_SIZE;
}

export const FabColors = {
    TONAL_PRIMARY: 'tonal-primary',
    TONAL_SECONDARY: 'tonal-secondary',
    TONAL_TERTIARY: 'tonal-tertiary',
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    TERTIARY: 'tertiary',
} as const;

export type FabColor = (typeof FabColors)[keyof typeof FabColors];

export const DEFAULT_FAB_COLOR: FabColor = FabColors.TONAL_PRIMARY;

export function fabColorAttribute(value: unknown) {
    return Object.values(FabColors).find((color) => color === value) ?? DEFAULT_FAB_COLOR;
}
