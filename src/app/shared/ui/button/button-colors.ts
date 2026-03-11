export const ButtonColors = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
} as const;

export type ButtonColor = (typeof ButtonColors)[keyof typeof ButtonColors];

export const DEFAULT_BUTTON_COLOR: ButtonColor = ButtonColors.PRIMARY;

export function buttonColorAttribute(value: ButtonColor | '') {
    return Object.values(ButtonColors).find((color) => color === value) ?? DEFAULT_BUTTON_COLOR;
}
