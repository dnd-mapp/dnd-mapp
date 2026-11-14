import { ComponentHarness, type TestElement } from '@angular/cdk/testing';

/** A part of a section intro: the eyebrow, the heading, or the intro text. */
export type SectionIntroPart = 'eyebrow' | 'heading' | 'intro';

/** How a section intro draws the text of one of its parts. */
export interface SectionIntroLook {
    color: string;
    fontWeight: string;
    textTransform: string;
    textAlign: string;
}

/** The place and height of a part of a section intro, relative to the section intro, in pixels. */
export interface SectionIntroPartBox {
    top: number;
    bottom: number;
}

const HEADING = ':is(h1, h2, h3, h4, h5, h6)';

export class SectionIntroHarness extends ComponentHarness {
    public static readonly hostSelector = 'hgroup[dma-section-intro]';

    private readonly parts: Record<SectionIntroPart, () => Promise<TestElement | null>> = {
        eyebrow: this.locatorForOptional(`:scope > p:has(~ ${HEADING})`),
        heading: this.locatorForOptional(`:scope > ${HEADING}`),
        intro: this.locatorForOptional(`:scope > ${HEADING} ~ p`),
    };

    /** The text of a part, or `null` when the section intro projects none. */
    public async getText(part: SectionIntroPart): Promise<string | null> {
        return (await (await this.parts[part]())?.text()) ?? null;
    }

    /** How the section intro draws the text of a part. */
    public async getLook(part: SectionIntroPart): Promise<SectionIntroLook> {
        const element = await this.getPart(part);
        const [color, fontWeight, textTransform, textAlign] = await Promise.all([
            element.getCssValue('color'),
            element.getCssValue('font-weight'),
            element.getCssValue('text-transform'),
            element.getCssValue('text-align'),
        ]);

        return { color, fontWeight, textTransform, textAlign };
    }

    /** Where a part starts and ends, measured down from the top of the section intro. */
    public async getBox(part: SectionIntroPart): Promise<SectionIntroPartBox> {
        const [host, element] = await Promise.all([(await this.host()).getDimensions(), this.getPart(part)]);
        const { top, height } = await element.getDimensions();

        return { top: top - host.top, bottom: top - host.top + height };
    }

    /** The width of the section intro, in pixels. */
    public async getWidth(): Promise<number> {
        return (await (await this.host()).getDimensions()).width;
    }

    private async getPart(part: SectionIntroPart): Promise<TestElement> {
        const element = await this.parts[part]();

        if (!element) {
            throw new Error(`The section intro projects no ${part}.`);
        }
        return element;
    }
}
