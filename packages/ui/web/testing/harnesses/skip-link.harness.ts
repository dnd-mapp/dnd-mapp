import { ComponentHarness } from '@angular/cdk/testing';

/** How a skip link draws its label and its fill. */
export interface SkipLinkLook {
    background: string;
    color: string;
    fontWeight: string;
}

/** The place of a skip link in the viewport, and the size and corners of its box, in pixels. */
export interface SkipLinkBox {
    top: number;
    left: number;
    height: number;
    paddingLeft: string;
    paddingRight: string;
    borderRadius: string;
}

/** The focus ring a skip link draws, read from its outline. */
export interface SkipLinkFocusRing {
    style: string;
    color: string;
    width: string;
    offset: string;
}

export class SkipLinkHarness extends ComponentHarness {
    public static readonly hostSelector = 'a[dma-skip-link]';

    /** The text of the skip link, which names it to assistive technology. */
    public async getText(): Promise<string> {
        return await (await this.host()).text();
    }

    /** Whether the skip link shows: it has focus, so it no longer clips itself to nothing. */
    public async isShown(): Promise<boolean> {
        return (await (await this.host()).getCssValue('clip-path')) === 'none';
    }

    /** How the skip link draws its label and its fill. */
    public async getLook(): Promise<SkipLinkLook> {
        const host = await this.host();
        const [background, color, fontWeight] = await Promise.all([
            host.getCssValue('background-color'),
            host.getCssValue('color'),
            host.getCssValue('font-weight'),
        ]);

        return { background, color, fontWeight };
    }

    /** The place of the skip link in the viewport, its height, its inline padding, and its corners. */
    public async getBox(): Promise<SkipLinkBox> {
        const host = await this.host();
        const [{ top, left, height }, paddingLeft, paddingRight, borderRadius] = await Promise.all([
            host.getDimensions(),
            host.getCssValue('padding-left'),
            host.getCssValue('padding-right'),
            host.getCssValue('border-radius'),
        ]);

        return { top, left, height, paddingLeft, paddingRight, borderRadius };
    }

    /** The focus ring the skip link draws, whose style is `none` when it draws none. */
    public async getFocusRing(): Promise<SkipLinkFocusRing> {
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
