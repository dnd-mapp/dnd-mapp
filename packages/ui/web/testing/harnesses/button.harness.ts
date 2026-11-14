import { ComponentHarness } from '@angular/cdk/testing';

/** How a button draws its box. */
export interface ButtonLook {
    background: string;
    borderColor: string;
    color: string;
}

/** The focus ring a button draws, read from its outline. */
export interface ButtonFocusRing {
    style: string;
    color: string;
    width: string;
    offset: string;
}

export class ButtonHarness extends ComponentHarness {
    public static readonly hostSelector = 'button[dma-button], a[dma-button]';

    /** The text of the button, which names it to assistive technology unless it has an `aria-label`. */
    public async getText(): Promise<string> {
        return await (await this.host()).text();
    }

    /** How the button draws its box. */
    public async getLook(): Promise<ButtonLook> {
        const host = await this.host();
        const [background, borderColor, color] = await Promise.all([
            host.getCssValue('background-color'),
            host.getCssValue('border-top-color'),
            host.getCssValue('color'),
        ]);

        return { background, borderColor, color };
    }

    /** The width and height of the button in pixels. */
    public async getSize(): Promise<{ width: number; height: number }> {
        const { width, height } = await (await this.host()).getDimensions();

        return { width, height };
    }

    /** The focus ring the button draws, whose style is `none` when it draws none. */
    public async getFocusRing(): Promise<ButtonFocusRing> {
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
