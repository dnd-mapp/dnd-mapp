import { ComponentHarness } from '@angular/cdk/testing';

/** How a tab draws its label and its fill. */
export interface TabLook {
    background: string;
    color: string;
    fontWeight: string;
}

/** The size and the corners of the box of a tab. */
export interface TabBox {
    height: number;
    paddingLeft: string;
    paddingRight: string;
    borderRadius: string;
}

export class TabHarness extends ComponentHarness {
    public static readonly hostSelector = 'button[dma-tab]';

    /** The label of the tab, which names it to assistive technology. */
    public async getLabel(): Promise<string> {
        return await (await this.host()).text();
    }

    /** How the tab draws its label and its fill. */
    public async getLook(): Promise<TabLook> {
        const host = await this.host();
        const [background, color, fontWeight] = await Promise.all([
            host.getCssValue('background-color'),
            host.getCssValue('color'),
            host.getCssValue('font-weight'),
        ]);

        return { background, color, fontWeight };
    }

    /** The height in pixels, the inline padding, and the corners of the tab. */
    public async getBox(): Promise<TabBox> {
        const host = await this.host();
        const [{ height }, paddingLeft, paddingRight, borderRadius] = await Promise.all([
            host.getDimensions(),
            host.getCssValue('padding-left'),
            host.getCssValue('padding-right'),
            host.getCssValue('border-radius'),
        ]);

        return { height, paddingLeft, paddingRight, borderRadius };
    }

    /** The width and height of the tab in pixels. */
    public async getSize(): Promise<{ width: number; height: number }> {
        const { width, height } = await (await this.host()).getDimensions();

        return { width, height };
    }
}
