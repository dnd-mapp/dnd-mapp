import { ComponentHarness, type TestElement } from '@angular/cdk/testing';
import { LinkHarness } from './link.harness';

/** How a link group draws the text of its heading. */
export interface LinkGroupHeadingLook {
    color: string;
    fontWeight: string;
    textTransform: string;
}

/** Where a part of a link group starts and ends, relative to the link group, and how wide it is, in pixels. */
export interface LinkGroupBox {
    top: number;
    bottom: number;
    width: number;
}

export class LinkGroupHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-link-group';

    private readonly headingLocator = this.locatorFor(':scope > :is(h1, h2, h3, h4, h5, h6)');
    private readonly listLocator = this.locatorFor(':scope > ul');
    private readonly itemsLocator = this.locatorForAll(':scope > ul > li');
    private readonly linksLocator = this.locatorForAll(LinkHarness);

    /** The text of the heading. */
    public async getHeadingText(): Promise<string> {
        return await (await this.headingLocator()).text();
    }

    /** How the link group draws the text of its heading. */
    public async getHeadingLook(): Promise<LinkGroupHeadingLook> {
        const heading = await this.headingLocator();
        const [color, fontWeight, textTransform] = await Promise.all([
            heading.getCssValue('color'),
            heading.getCssValue('font-weight'),
            heading.getCssValue('text-transform'),
        ]);

        return { color, fontWeight, textTransform };
    }

    /** The harnesses of the links in the group, in their order. */
    public async getLinks(): Promise<LinkHarness[]> {
        return await this.linksLocator();
    }

    /** Where the heading starts and ends, measured down from the top of the link group. */
    public async getHeadingBox(): Promise<LinkGroupBox> {
        return await this.getBox(await this.headingLocator());
    }

    /** Where the list of links starts and ends, measured down from the top of the link group. */
    public async getListBox(): Promise<LinkGroupBox> {
        return await this.getBox(await this.listLocator());
    }

    /** Where each item of the list starts and ends, measured down from the top of the link group. */
    public async getItemBoxes(): Promise<LinkGroupBox[]> {
        return await Promise.all((await this.itemsLocator()).map((item) => this.getBox(item)));
    }

    /** The width of the link group, in pixels. */
    public async getWidth(): Promise<number> {
        return (await (await this.host()).getDimensions()).width;
    }

    private async getBox(element: TestElement): Promise<LinkGroupBox> {
        const [host, { top, height, width }] = await Promise.all([
            (await this.host()).getDimensions(),
            element.getDimensions(),
        ]);

        return { top: top - host.top, bottom: top - host.top + height, width };
    }
}
