import { ComponentHarness } from '@angular/cdk/testing';

/** How the link of On this page draws its label and its fill. */
export interface OnThisPageLinkLook {
    background: string;
    color: string;
    fontWeight: string;
}

/** The height in pixels, the padding, and the corners of the link of On this page. */
export interface OnThisPageLinkBox {
    height: number;
    padding: string;
    borderRadius: string;
}

/** The indicator at the start of the link, with its place and size in pixels relative to the top left of the link. */
export interface OnThisPageLinkIndicator {
    color: string;
    borderRadius: string;
    left: number;
    top: number;
    width: number;
    height: number;
}

/** The focus ring the link of On this page draws, read from its outline. */
export interface OnThisPageLinkFocusRing {
    style: string;
    color: string;
    width: string;
    offset: string;
}

export class OnThisPageLinkHarness extends ComponentHarness {
    public static readonly hostSelector = 'a[dma-on-this-page-link]';

    private readonly indicatorLocator = this.locatorFor('.indicator');

    /** The text of the link, which names it to assistive technology. */
    public async getText(): Promise<string> {
        return await (await this.host()).text();
    }

    /** How the link draws its label and its fill. */
    public async getLook(): Promise<OnThisPageLinkLook> {
        const host = await this.host();
        const [background, color, fontWeight] = await Promise.all([
            host.getCssValue('background-color'),
            host.getCssValue('color'),
            host.getCssValue('font-weight'),
        ]);

        return { background, color, fontWeight };
    }

    /** The height, padding, and corners of the link. */
    public async getBox(): Promise<OnThisPageLinkBox> {
        const host = await this.host();
        const [{ height }, padding, borderRadius] = await Promise.all([
            host.getDimensions(),
            host.getCssValue('padding'),
            host.getCssValue('border-radius'),
        ]);

        return { height, padding, borderRadius };
    }

    /** The width and height of the link in pixels. */
    public async getSize(): Promise<{ width: number; height: number }> {
        const { width, height } = await (await this.host()).getDimensions();

        return { width, height };
    }

    /** Whether the link marks the section in view, through `aria-current="location"`. */
    public async isCurrent(): Promise<boolean> {
        return (await (await this.host()).getAttribute('aria-current')) === 'location';
    }

    /** The indicator at the start of the link. */
    public async getIndicator(): Promise<OnThisPageLinkIndicator> {
        const [host, indicator] = await Promise.all([this.host(), this.indicatorLocator()]);
        const [link, box, color, borderRadius] = await Promise.all([
            host.getDimensions(),
            indicator.getDimensions(),
            indicator.getCssValue('background-color'),
            indicator.getCssValue('border-radius'),
        ]);

        return {
            color,
            borderRadius,
            left: box.left - link.left,
            top: box.top - link.top,
            width: box.width,
            height: box.height,
        };
    }

    /** The focus ring the link draws, whose style is `none` when it draws none. */
    public async getFocusRing(): Promise<OnThisPageLinkFocusRing> {
        const host = await this.host();
        const [style, color, width, offset] = await Promise.all([
            host.getCssValue('outline-style'),
            host.getCssValue('outline-color'),
            host.getCssValue('outline-width'),
            host.getCssValue('outline-offset'),
        ]);

        return { style, color, width, offset };
    }
}
