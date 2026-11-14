import { ComponentHarness } from '@angular/cdk/testing';
import { IconHarness } from './icon.harness';

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

/** How far an icon of a button sits from each edge of the button, in pixels. */
export interface ButtonIconInsets {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export class ButtonHarness extends ComponentHarness {
    public static readonly hostSelector = 'button[dma-button], a[dma-button]';

    private readonly iconsLocator = this.locatorForAll(IconHarness);
    private readonly iconElementsLocator = this.locatorForAll(IconHarness.hostSelector);

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

    /** The icons the button projects, in the order they draw. */
    public async getIcons(): Promise<IconHarness[]> {
        return await this.iconsLocator();
    }

    /** How far each icon of the button sits from the edges of the button, in the order they draw. */
    public async getIconInsets(): Promise<ButtonIconInsets[]> {
        const [button, icons] = await Promise.all([(await this.host()).getDimensions(), this.iconElementsLocator()]);

        return await Promise.all(
            icons.map(async (icon) => {
                const { top, left, width, height } = await icon.getDimensions();

                return {
                    top: top - button.top,
                    right: button.left + button.width - (left + width),
                    bottom: button.top + button.height - (top + height),
                    left: left - button.left,
                };
            }),
        );
    }
}
