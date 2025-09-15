export const ButtonTypes = {
    ELEVATED: 'elevated',
    FILLED: 'filled',
    TONAL: 'tonal',
    OUTLINED: 'outlined',
    TEXT: 'text',
} as const;

export type ButtonType = (typeof ButtonTypes)[keyof typeof ButtonTypes];

export const DEFAULT_BUTTON_TYPE: ButtonType = ButtonTypes.FILLED;

export function buttonTypeAttribute(value: unknown) {
    return Object.values(ButtonTypes).find((type) => type === value) ?? DEFAULT_BUTTON_TYPE;
}

export const ButtonSizes = {
    EXTRA_SMALL: 'xs',
    SMALL: 'sm',
    MEDIUM: 'me',
    LARGE: 'lg',
    EXTRA_LARGE: 'xl',
} as const;

export type ButtonSize = (typeof ButtonSizes)[keyof typeof ButtonSizes];

export const DEFAULT_BUTTON_SIZE: ButtonSize = ButtonSizes.SMALL;

export function buttonSizeAttribute(value: unknown) {
    return Object.values(ButtonSizes).find((size) => size === value) ?? DEFAULT_BUTTON_SIZE;
}

export const ButtonShapes = {
    ROUND: 'round',
    SQUARE: 'square',
} as const;

export type ButtonShape = (typeof ButtonShapes)[keyof typeof ButtonShapes];

export const DEFAULT_BUTTON_SHAPE: ButtonShape = ButtonShapes.ROUND;

export function buttonShapeAttribute(value: unknown) {
    return Object.values(ButtonShapes).find((shape) => shape === value) ?? DEFAULT_BUTTON_SHAPE;
}
