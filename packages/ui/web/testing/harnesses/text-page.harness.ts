import { ComponentHarness, type TestElement } from '@angular/cdk/testing';

/** A part of the title block of a text page: the title, or the date it was last updated. */
export type TextPagePart = 'title' | 'date';

/** How a text page draws the text of a part, or of an element of its prose. */
export interface TextPageLook {
    color: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
}

/** An element of the prose of a text page: its tag name in lowercase, and its text. */
export interface TextPageProseElement {
    tag: string;
    text: string;
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
    private readonly getProseElements = this.locatorForAll(':scope > .prose > *');
    private readonly getListItemElements = this.locatorForAll(':scope > .prose > :is(ul, ol) > li');

    /** The text of a part. */
    public async getText(part: TextPagePart): Promise<string> {
        return await (await this.parts[part]()).text();
    }

    /** The `datetime` of the `<time>` in the date, or `null` when it has none. */
    public async getDateTime(): Promise<string | null> {
        return await (await this.getTimeElement()).getAttribute('datetime');
    }

    /** The tag name and the text of each element of the prose, in order. */
    public async getProse(): Promise<TextPageProseElement[]> {
        return await Promise.all(
            (await this.getProseElements()).map(async (element) => {
                const [tag, text] = await Promise.all([element.getProperty<string>('localName'), element.text()]);

                return { tag, text };
            }),
        );
    }

    /** The text of each item of the lists of the prose, in order. */
    public async getListItems(): Promise<string[]> {
        return await Promise.all((await this.getListItemElements()).map((item) => item.text()));
    }

    /** How the text page draws the text of a part. */
    public async getLook(part: TextPagePart): Promise<TextPageLook> {
        return await this.toLook(await this.parts[part]());
    }

    /** How the text page draws the text of each element of the prose, in order. */
    public async getProseLooks(): Promise<TextPageLook[]> {
        return await Promise.all((await this.getProseElements()).map((element) => this.toLook(element)));
    }

    /** Where a part, or the prose as a whole, sits, measured from the top left of the text page. */
    public async getBox(part: TextPagePart | 'prose'): Promise<TextPageBox> {
        return await this.toBox(await (part === 'prose' ? this.getProseElement() : this.parts[part]()));
    }

    /** Where each element of the prose sits, in order, measured from the top left of the text page. */
    public async getProseBoxes(): Promise<TextPageBox[]> {
        return await Promise.all((await this.getProseElements()).map((element) => this.toBox(element)));
    }

    /** Where each item of the lists of the prose sits, in order, measured from the top left of the text page. */
    public async getListItemBoxes(): Promise<TextPageBox[]> {
        return await Promise.all((await this.getListItemElements()).map((item) => this.toBox(item)));
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
