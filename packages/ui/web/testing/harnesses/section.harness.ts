import { ComponentHarness, type TestElement } from '@angular/cdk/testing';

/** How a section draws its box. */
export interface SectionLook {
    background: string;
    padding: string;
}

/** The place and size of the content of a section, or of one of its children, relative to the section, in pixels. */
export interface SectionBox {
    top: number;
    bottom: number;
    left: number;
    width: number;
}

/** The size of a section, in pixels. */
export interface SectionSize {
    width: number;
    height: number;
}

export class SectionHarness extends ComponentHarness {
    public static readonly hostSelector = 'section[dma-section]';

    private readonly contentLocator = this.locatorFor(':scope > .content');
    private readonly childrenLocator = this.locatorForAll(':scope > .content > *');

    /** The text of the content the section projects. */
    public async getText(): Promise<string> {
        return await (await this.contentLocator()).text();
    }

    /** How the section draws its box. */
    public async getLook(): Promise<SectionLook> {
        const host = await this.host();
        const [background, padding] = await Promise.all([
            host.getCssValue('background-color'),
            host.getCssValue('padding'),
        ]);

        return { background, padding };
    }

    /** Where the content sits, measured from the top left of the section. */
    public async getContentBox(): Promise<SectionBox> {
        return await this.toBox(await this.contentLocator());
    }

    /** Where each projected child sits, in its order, measured from the top left of the section. */
    public async getChildBoxes(): Promise<SectionBox[]> {
        const children = await this.childrenLocator();

        return await Promise.all(children.map((child) => this.toBox(child)));
    }

    /** The width and height of the section. */
    public async getSize(): Promise<SectionSize> {
        const { width, height } = await (await this.host()).getDimensions();

        return { width, height };
    }

    private async toBox(element: TestElement): Promise<SectionBox> {
        const [host, { top, left, width, height }] = await Promise.all([
            (await this.host()).getDimensions(),
            element.getDimensions(),
        ]);

        return { top: top - host.top, bottom: top - host.top + height, left: left - host.left, width };
    }
}
