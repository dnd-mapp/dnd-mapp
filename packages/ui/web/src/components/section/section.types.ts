/**
 * What a section fills itself with: the page background, or the surface background, so a band of sections can tell
 * one section from the next.
 */
export const SectionBackground = {
    Page: 'page',
    Surface: 'surface',
} as const;

export type SectionBackground = (typeof SectionBackground)[keyof typeof SectionBackground];

export const DEFAULT_SECTION_BACKGROUND: SectionBackground = SectionBackground.Page;

/** Passes a valid background through, and turns any other value into the default background. */
export function sectionBackgroundAttr(value: SectionBackground): SectionBackground {
    return Object.values(SectionBackground).includes(value) ? value : DEFAULT_SECTION_BACKGROUND;
}
