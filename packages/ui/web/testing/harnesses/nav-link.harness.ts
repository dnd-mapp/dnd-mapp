import { ComponentHarness } from '@angular/cdk/testing';

/** How a nav link draws its label and its fill. */
export interface NavLinkLook {
    background: string;
    color: string;
    fontWeight: string;
}

/** The size and the corners of the box of a nav link. */
export interface NavLinkBox {
    height: number;
    paddingLeft: string;
    paddingRight: string;
    borderRadius: string;
}

/** The indicator of the current page, with its place and size in pixels relative to the top left of the label. */
export interface NavLinkIndicator {
    color: string;
    borderRadius: string;
    left: number;
    top: number;
    width: number;
    height: number;
}

/** The focus ring a nav link draws, read from its outline. */
export interface NavLinkFocusRing {
    style: string;
    color: string;
    width: string;
    offset: string;
}

export class NavLinkHarness extends ComponentHarness {
    public static readonly hostSelector = 'a[dma-nav-link]';

    private readonly labelLocator = this.locatorFor('.label');
    private readonly indicatorLocator = this.locatorFor('.indicator');

    /** The text of the nav link, which names it to assistive technology. */
    public async getText(): Promise<string> {
        return await (await this.host()).text();
    }

    /** How the nav link draws its label and its fill. */
    public async getLook(): Promise<NavLinkLook> {
        const host = await this.host();
        const [background, color, fontWeight] = await Promise.all([
            host.getCssValue('background-color'),
            host.getCssValue('color'),
            host.getCssValue('font-weight'),
        ]);

        return { background, color, fontWeight };
    }

    /** The height in pixels, the inline padding, and the corners of the nav link. */
    public async getBox(): Promise<NavLinkBox> {
        const host = await this.host();
        const [{ height }, paddingLeft, paddingRight, borderRadius] = await Promise.all([
            host.getDimensions(),
            host.getCssValue('padding-left'),
            host.getCssValue('padding-right'),
            host.getCssValue('border-radius'),
        ]);

        return { height, paddingLeft, paddingRight, borderRadius };
    }

    /** The width and height of the nav link in pixels. */
    public async getSize(): Promise<{ width: number; height: number }> {
        const { width, height } = await (await this.host()).getDimensions();

        return { width, height };
    }

    /** Whether the nav link marks the current page, through `aria-current="page"`. */
    public async isCurrent(): Promise<boolean> {
        return (await (await this.host()).getAttribute('aria-current')) === 'page';
    }

    /** The width and height of the label in pixels. */
    public async getLabelSize(): Promise<{ width: number; height: number }> {
        const { width, height } = await (await this.labelLocator()).getDimensions();

        return { width, height };
    }

    /** The indicator of the current page, or null when the nav link draws none. */
    public async getIndicator(): Promise<NavLinkIndicator | null> {
        const indicator = await this.indicatorLocator();

        if ((await indicator.getCssValue('display')) === 'none') {
            return null;
        }
        const [label, box, color, borderRadius] = await Promise.all([
            (await this.labelLocator()).getDimensions(),
            indicator.getDimensions(),
            indicator.getCssValue('background-color'),
            indicator.getCssValue('border-radius'),
        ]);

        return {
            color,
            borderRadius,
            left: box.left - label.left,
            top: box.top - label.top,
            width: box.width,
            height: box.height,
        };
    }

    /** The focus ring the nav link draws, whose style is `none` when it draws none. */
    public async getFocusRing(): Promise<NavLinkFocusRing> {
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
