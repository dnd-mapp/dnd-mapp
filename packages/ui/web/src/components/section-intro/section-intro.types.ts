/** How a section intro aligns its text: to the start of the line, or to its center. */
export const SectionIntroAlign = {
    Start: 'start',
    Center: 'center',
} as const;

export type SectionIntroAlign = (typeof SectionIntroAlign)[keyof typeof SectionIntroAlign];

export const DEFAULT_SECTION_INTRO_ALIGN: SectionIntroAlign = SectionIntroAlign.Start;

/** Passes a valid alignment through, and turns any other value into the default alignment. */
export function sectionIntroAlignAttr(value: SectionIntroAlign): SectionIntroAlign {
    return Object.values(SectionIntroAlign).includes(value) ? value : DEFAULT_SECTION_INTRO_ALIGN;
}
