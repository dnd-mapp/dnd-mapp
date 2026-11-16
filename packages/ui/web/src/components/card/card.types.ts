/**
 * What a card fills itself with, by what it sits on: surface, for a card on the page background, or raised, for a
 * card on a surface, so the card always stands one step above its background.
 */
export const CardBackground = {
    Surface: 'surface',
    Raised: 'raised',
} as const;

export type CardBackground = (typeof CardBackground)[keyof typeof CardBackground];

export const DEFAULT_CARD_BACKGROUND: CardBackground = CardBackground.Surface;

/** Passes a valid background through, and turns any other value into the default background. */
export function cardBackgroundAttr(value: CardBackground): CardBackground {
    return Object.values(CardBackground).includes(value) ? value : DEFAULT_CARD_BACKGROUND;
}
