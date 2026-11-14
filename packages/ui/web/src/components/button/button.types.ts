/**
 * How a button looks: primary, for the one main action of a view, secondary, for its other calls to action, or quiet,
 * for the tools in the header and menu.
 */
export const ButtonKind = {
    Primary: 'primary',
    Secondary: 'secondary',
    Quiet: 'quiet',
} as const;

export type ButtonKind = (typeof ButtonKind)[keyof typeof ButtonKind];

export const DEFAULT_BUTTON_KIND: ButtonKind = ButtonKind.Primary;

/** Passes a valid kind through, and turns any other value into the default kind. */
export function buttonKindAttr(value: ButtonKind): ButtonKind {
    return Object.values(ButtonKind).includes(value) ? value : DEFAULT_BUTTON_KIND;
}
