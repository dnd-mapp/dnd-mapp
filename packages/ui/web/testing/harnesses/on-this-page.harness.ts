import { ComponentHarness, type TestElement } from '@angular/cdk/testing';
import { OnThisPageLinkHarness } from './on-this-page-link.harness';

/** How On this page draws the text of its title. */
export interface OnThisPageTitleLook {
    color: string;
    fontWeight: string;
    textTransform: string;
}

/** Where a part of On this page starts and ends, relative to the top of the nav, and how wide it is, in pixels. */
export interface OnThisPageBox {
    top: number;
    bottom: number;
    width: number;
}

/** How On this page sticks while the page scrolls: its CSS position, and its offset from the top of the viewport. */
export interface OnThisPageStickiness {
    position: string;
    top: string;
}

export class OnThisPageHarness extends ComponentHarness {
    public static readonly hostSelector = 'nav[dma-on-this-page]';

    private readonly titleLocator = this.locatorFor(':scope > .title');
    private readonly listLocator = this.locatorFor(':scope > ul');
    private readonly itemsLocator = this.locatorForAll(':scope > ul > li');
    private readonly linksLocator = this.locatorForAll(OnThisPageLinkHarness);

    /** The text of the title, which names the nav. */
    public async getTitleText(): Promise<string> {
        return await (await this.titleLocator()).text();
    }

    /** How the nav draws the text of its title. */
    public async getTitleLook(): Promise<OnThisPageTitleLook> {
        const title = await this.titleLocator();
        const [color, fontWeight, textTransform] = await Promise.all([
            title.getCssValue('color'),
            title.getCssValue('font-weight'),
            title.getCssValue('text-transform'),
        ]);

        return { color, fontWeight, textTransform };
    }

    /** The harnesses of the links of the nav, in their order. */
    public async getLinks(): Promise<OnThisPageLinkHarness[]> {
        return await this.linksLocator();
    }

    /** Where the title starts and ends, measured down from the top of the nav. */
    public async getTitleBox(): Promise<OnThisPageBox> {
        return await this.getBox(await this.titleLocator());
    }

    /** Where the list of links starts and ends, measured down from the top of the nav. */
    public async getListBox(): Promise<OnThisPageBox> {
        return await this.getBox(await this.listLocator());
    }

    /** Where each item of the list starts and ends, measured down from the top of the nav. */
    public async getItemBoxes(): Promise<OnThisPageBox[]> {
        return await Promise.all((await this.itemsLocator()).map((item) => this.getBox(item)));
    }

    /** The width of the nav, in pixels. */
    public async getWidth(): Promise<number> {
        return (await (await this.host()).getDimensions()).width;
    }

    /** The distance from the top of the viewport to the top of the nav, in pixels. */
    public async getTop(): Promise<number> {
        return (await (await this.host()).getDimensions()).top;
    }

    /** How the nav sticks while the page scrolls. */
    public async getStickiness(): Promise<OnThisPageStickiness> {
        const host = await this.host();
        const [position, top] = await Promise.all([host.getCssValue('position'), host.getCssValue('top')]);

        return { position, top };
    }

    private async getBox(element: TestElement): Promise<OnThisPageBox> {
        const [host, { top, height, width }] = await Promise.all([
            (await this.host()).getDimensions(),
            element.getDimensions(),
        ]);

        return { top: top - host.top, bottom: top - host.top + height, width };
    }
}
