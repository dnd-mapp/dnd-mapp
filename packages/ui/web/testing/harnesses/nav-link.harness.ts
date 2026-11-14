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

/** The focus ring a nav link draws, read from its outline. */
export interface NavLinkFocusRing {
    style: string;
    color: string;
    width: string;
    offset: string;
}

export class NavLinkHarness extends ComponentHarness {
    public static readonly hostSelector = 'a[dma-nav-link]';

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
