export const ButtonTypes = {
    TEXT: 'text',
    PRIMARY: 'primary',
    DANGER: 'danger',
    DANGER_SUBTLE: 'danger-subtle',
} as const;

export type ButtonType = (typeof ButtonTypes)[keyof typeof ButtonTypes];

export const DEFAULT_BUTTON_TYPE: ButtonType = ButtonTypes.TEXT;

export function buttonTypeAttribute(value: unknown) {
    return Object.values(ButtonTypes).find((type) => value === type) ?? DEFAULT_BUTTON_TYPE;
}
