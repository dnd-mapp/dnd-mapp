import { ComponentHarness } from '@angular/cdk/testing';

/** The focus ring a link draws, read from its outline. */
export interface LinkFocusRing {
    style: string;
    color: string;
    width: string;
    offset: string;
}

export class LinkHarness extends ComponentHarness {
    public static readonly hostSelector = 'a[dma-link]';

    private readonly arrowLocator = this.locatorForOptional('dma-icon-arrow-right');

    /** The text of the link, which names it to assistive technology. */
    public async getText(): Promise<string> {
        return await (await this.host()).text();
    }

    /** The color of the text of the link. */
    public async getColor(): Promise<string> {
        return await (await this.host()).getCssValue('color');
    }

    /** The weight of the font of the link, such as `400`. */
    public async getFontWeight(): Promise<string> {
        return await (await this.host()).getCssValue('font-weight');
    }

    /** Whether the link draws an underline. */
    public async isUnderlined(): Promise<boolean> {
        return (await (await this.host()).getCssValue('text-decoration-line')) === 'underline';
    }

    /** The focus ring the link draws, whose style is `none` when it draws none. */
    public async getFocusRing(): Promise<LinkFocusRing> {
        const host = await this.host();
        const [style, color, width, offset] = await Promise.all([
            host.getCssValue('outline-style'),
            host.getCssValue('outline-color'),
            host.getCssValue('outline-width'),
            host.getCssValue('outline-offset'),
        ]);

        return { style, color, width, offset };
    }

    /** Whether the link ends in an arrow. */
    public async hasArrow(): Promise<boolean> {
        return (await this.arrowLocator()) !== null;
    }

    /** Whether the arrow ends the link: its right edge is the right edge of the link. */
    public async isArrowAtEnd(): Promise<boolean> {
        const arrow = await this.arrowLocator();

        if (!arrow) {
            return false;
        }
        const [link, icon] = await Promise.all([(await this.host()).getDimensions(), arrow.getDimensions()]);

        return Math.round(icon.left + icon.width) === Math.round(link.left + link.width);
    }

    /** The width and height of the arrow in pixels, or null when the link has none. */
    public async getArrowSize(): Promise<{ width: number; height: number } | null> {
        const arrow = await this.arrowLocator();

        if (!arrow) {
            return null;
        }
        const { width, height } = await arrow.getDimensions();

        return { width, height };
    }
}
