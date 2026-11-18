import { ComponentHarness, type TestElement } from '@angular/cdk/testing';

/** A part of the title block of a text page: the title, or the date it was last updated. */
export type TextPagePart = 'title' | 'date';

/** How a text page draws the text of a part. */
export interface TextPageLook {
    color: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
}

/** The place and size of a part of a text page, relative to the text page, in pixels. */
export interface TextPageBox {
    top: number;
    bottom: number;
    left: number;
    width: number;
}

export class TextPageHarness extends ComponentHarness {
    public static readonly hostSelector = 'article[dma-text-page]';

    private readonly parts: Record<TextPagePart, () => Promise<TestElement>> = {
        title: this.locatorFor(':scope > header > h1'),
        date: this.locatorFor(':scope > header > p'),
    };

    private readonly getTimeElement = this.locatorFor(':scope > header > p time');
    private readonly getProseElement = this.locatorFor(':scope > .prose');

    /** The text of a part. */
    public async getText(part: TextPagePart): Promise<string> {
        return await (await this.parts[part]()).text();
    }

    /** The `datetime` of the `<time>` in the date, or `null` when it has none. */
    public async getDateTime(): Promise<string | null> {
        return await (await this.getTimeElement()).getAttribute('datetime');
    }

    /** How the text page draws the text of a part. */
    public async getLook(part: TextPagePart): Promise<TextPageLook> {
        return await this.toLook(await this.parts[part]());
    }

    /** Where a part, or the prose as a whole, sits, measured from the top left of the text page. */
    public async getBox(part: TextPagePart | 'prose'): Promise<TextPageBox> {
        return await this.toBox(await (part === 'prose' ? this.getProseElement() : this.parts[part]()));
    }

    /** The width of the text page, in pixels. */
    public async getWidth(): Promise<number> {
        return (await (await this.host()).getDimensions()).width;
    }

    private async toLook(element: TestElement): Promise<TextPageLook> {
        const [color, fontSize, fontWeight, lineHeight] = await Promise.all([
            element.getCssValue('color'),
            element.getCssValue('font-size'),
            element.getCssValue('font-weight'),
            element.getCssValue('line-height'),
        ]);

        return { color, fontSize, fontWeight, lineHeight };
    }

    private async toBox(element: TestElement): Promise<TextPageBox> {
        const [host, { top, left, width, height }] = await Promise.all([
            (await this.host()).getDimensions(),
            element.getDimensions(),
        ]);

        return { top: top - host.top, bottom: top - host.top + height, left: left - host.left, width };
    }
}
