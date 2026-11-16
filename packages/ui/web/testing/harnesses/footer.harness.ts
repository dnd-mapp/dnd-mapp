import { ComponentHarness, type TestElement } from '@angular/cdk/testing';
import { LinkGroupHarness } from './link-group.harness';
import { LogoHarness } from './logo.harness';

/** A part of a footer that the footer draws itself, rather than the columns that its consumer projects. */
export type FooterPart = 'brand' | FooterText | 'groups' | 'bottom' | 'legal';

/** A text that a footer draws itself. */
export type FooterText = 'tagline' | 'license' | 'attribution';

/** How a footer draws itself: its background, its padding, and the line above its legal text. */
export interface FooterLook {
    background: string;
    padding: string;
    dividerColor: string;
    dividerWidth: string;
}

/** How a footer draws a text of its own, such as the tagline or the license line. */
export interface FooterTextLook {
    color: string;
    fontSize: string;
}

/** A link in the SRD 5.1 attribution: its text, its target, and whether it is underlined. */
export interface FooterAttributionLink {
    text: string;
    href: string | null;
    underlined: boolean;
}

/** The place and size of a part of a footer, relative to the footer, in pixels. */
export interface FooterBox {
    top: number;
    left: number;
    width: number;
    height: number;
}

const PART_SELECTORS: Record<FooterPart, string> = {
    brand: ':scope > .top > .brand',
    tagline: ':scope > .top > .brand > .tagline',
    groups: ':scope > .top > .groups',
    bottom: ':scope > .bottom',
    legal: ':scope > .bottom > .legal',
    license: ':scope > .bottom > .legal > .license',
    attribution: ':scope > .bottom > .legal > .attribution',
};

export class FooterHarness extends ComponentHarness {
    public static readonly hostSelector = 'footer[dma-footer]';

    private readonly columnsLocator = this.locatorForAll(':scope > .top > .groups > nav');
    private readonly attributionLinksLocator = this.locatorForAll(':scope > .bottom > .legal > .attribution > a');

    /** The harness of the logo in the brand. */
    public readonly getLogo = this.locatorFor(LogoHarness);

    /** The harnesses of the link groups in the projected columns, in their order. */
    public readonly getLinkGroups = this.locatorForAll(LinkGroupHarness);

    /** The text of a part of the footer, with its white space collapsed. */
    public async getText(part: FooterText): Promise<string> {
        const element = await this.getPart(part);

        return (await element.text()).replace(/\s+/g, ' ').trim();
    }

    /** How the footer draws a text of its own. */
    public async getTextLook(part: FooterText): Promise<FooterTextLook> {
        const element = await this.getPart(part);
        const [color, fontSize] = await Promise.all([element.getCssValue('color'), element.getCssValue('font-size')]);

        return { color, fontSize };
    }

    /** The links in the SRD 5.1 attribution, in their order. */
    public async getAttributionLinks(): Promise<FooterAttributionLink[]> {
        return await Promise.all(
            (await this.attributionLinksLocator()).map(async (link) => {
                const [text, href, decoration] = await Promise.all([
                    link.text(),
                    link.getAttribute('href'),
                    link.getCssValue('text-decoration-line'),
                ]);

                return { text, href, underlined: decoration === 'underline' };
            }),
        );
    }

    /** How the footer draws itself. */
    public async getLook(): Promise<FooterLook> {
        const [host, bottom] = await Promise.all([this.host(), this.getPart('bottom')]);
        const [background, padding, dividerColor, dividerWidth] = await Promise.all([
            host.getCssValue('background-color'),
            host.getCssValue('padding'),
            bottom.getCssValue('border-top-color'),
            bottom.getCssValue('border-top-width'),
        ]);

        return { background, padding, dividerColor, dividerWidth };
    }

    /** Where a part of the footer sits, measured from the top left of the footer. */
    public async getBox(part: FooterPart): Promise<FooterBox> {
        return await this.getBoxOf(await this.getPart(part));
    }

    /** Where each projected column sits, measured from the top left of the footer. */
    public async getColumnBoxes(): Promise<FooterBox[]> {
        return await Promise.all((await this.columnsLocator()).map((column) => this.getBoxOf(column)));
    }

    /** The width of the footer, in pixels. */
    public async getWidth(): Promise<number> {
        return (await (await this.host()).getDimensions()).width;
    }

    private async getPart(part: FooterPart): Promise<TestElement> {
        return await this.locatorFor(PART_SELECTORS[part])();
    }

    private async getBoxOf(element: TestElement): Promise<FooterBox> {
        const [host, { top, left, width, height }] = await Promise.all([
            (await this.host()).getDimensions(),
            element.getDimensions(),
        ]);

        return { top: top - host.top, left: left - host.left, width, height };
    }
}
