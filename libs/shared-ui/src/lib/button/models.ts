export const ButtonTypes = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    DANGER: 'danger',
} as const;

export type ButtonType = (typeof ButtonTypes)[keyof typeof ButtonTypes];

export function buttonTypeAttribute(value: unknown) {
    return Object.values(ButtonTypes).find((buttonType: ButtonType) => buttonType === value) ?? ButtonTypes.SECONDARY;
}
