/**
 * How a chip looks: neutral, for tool names and conditions, status, for features that are not built yet, such as
 * Planned and Concept, or DM, for tools meant for dungeon masters.
 */
export const ChipKind = {
    Neutral: 'neutral',
    Status: 'status',
    Dm: 'dm',
} as const;

export type ChipKind = (typeof ChipKind)[keyof typeof ChipKind];

export const DEFAULT_CHIP_KIND: ChipKind = ChipKind.Neutral;

/** Passes a valid kind through, and turns any other value into the default kind. */
export function chipKindAttr(value: ChipKind): ChipKind {
    return Object.values(ChipKind).includes(value) ? value : DEFAULT_CHIP_KIND;
}
