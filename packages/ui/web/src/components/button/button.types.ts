/** How a button looks: primary, for the main action of a view. */
export const ButtonKind = {
    Primary: 'primary',
} as const;

export type ButtonKind = (typeof ButtonKind)[keyof typeof ButtonKind];

export const DEFAULT_BUTTON_KIND: ButtonKind = ButtonKind.Primary;

/** Passes a valid kind through, and turns any other value into the default kind. */
export function buttonKindAttr(value: ButtonKind): ButtonKind {
    return Object.values(ButtonKind).includes(value) ? value : DEFAULT_BUTTON_KIND;
}
