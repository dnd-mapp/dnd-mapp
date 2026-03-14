export const ButtonSizes = {
    MEDIUM: 'md',
    LARGE: 'lg',
} as const;

export type ButtonSize = (typeof ButtonSizes)[keyof typeof ButtonSizes];

export const DEFAULT_BUTTON_SIZE: ButtonSize = ButtonSizes.MEDIUM;
