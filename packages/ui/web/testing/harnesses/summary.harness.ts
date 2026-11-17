import { ComponentHarness } from '@angular/cdk/testing';

/** How a summary draws its box. */
export interface SummaryLook {
    background: string;
    borderColor: string;
    borderWidth: string;
    borderRadius: string;
}

/** How a summary draws the text of its title. */
export interface SummaryTitleLook {
    color: string;
    fontWeight: string;
    textTransform: string;
}

/** The place and size of a part of a summary, relative to the summary, in pixels. */
export interface SummaryPartBox {
    top: number;
    bottom: number;
    left: number;
    width: number;
}

export class SummaryHarness extends ComponentHarness {
    public static readonly hostSelector = 'section[dma-summary]';

    private readonly getTitleElement = this.locatorFor(':scope > [dma-summary-title]');
    private readonly getPointsElement = this.locatorFor(':scope > ul');
    private readonly getPointElements = this.locatorForAll(':scope > ul > li');

    /** The text of the title. */
    public async getTitle(): Promise<string> {
        return await (await this.getTitleElement()).text();
    }

    /** The id of the title, or `null` when it has none. */
    public async getTitleId(): Promise<string | null> {
        return await (await this.getTitleElement()).getAttribute('id');
    }

    /** The id of the element that names the summary, from `aria-labelledby`. */
    public async getLabelledBy(): Promise<string | null> {
        return await (await this.host()).getAttribute('aria-labelledby');
    }

    /** The text of each point, in order. */
    public async getPoints(): Promise<string[]> {
        return Promise.all((await this.getPointElements()).map((point) => point.text()));
    }

    /** How the summary draws its box. */
    public async getLook(): Promise<SummaryLook> {
        const host = await this.host();
        const [background, borderColor, borderWidth, borderRadius] = await Promise.all([
            host.getCssValue('background-color'),
            host.getCssValue('border-top-color'),
            host.getCssValue('border-top-width'),
            host.getCssValue('border-top-left-radius'),
        ]);

        return { background, borderColor, borderWidth, borderRadius };
    }

    /** How the summary draws the text of its title. */
    public async getTitleLook(): Promise<SummaryTitleLook> {
        const title = await this.getTitleElement();
        const [color, fontWeight, textTransform] = await Promise.all([
            title.getCssValue('color'),
            title.getCssValue('font-weight'),
            title.getCssValue('text-transform'),
        ]);

        return { color, fontWeight, textTransform };
    }

    /** Where the title or the points sit, measured from the top left of the summary. */
    public async getBox(part: 'title' | 'points'): Promise<SummaryPartBox> {
        const element = await (part === 'title' ? this.getTitleElement() : this.getPointsElement());
        const [host, { top, left, width, height }] = await Promise.all([
            (await this.host()).getDimensions(),
            element.getDimensions(),
        ]);

        return { top: top - host.top, bottom: top - host.top + height, left: left - host.left, width };
    }

    /** The width of the summary, in pixels. */
    public async getWidth(): Promise<number> {
        return (await (await this.host()).getDimensions()).width;
    }
}
