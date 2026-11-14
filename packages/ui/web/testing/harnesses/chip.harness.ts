import { ComponentHarness } from '@angular/cdk/testing';

/** How a chip draws its box. */
export interface ChipLook {
    background: string;
    borderColor: string;
    color: string;
}

export class ChipHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-chip';

    /** The text of the chip, which carries its meaning. */
    public async getText(): Promise<string> {
        return await (await this.host()).text();
    }

    /** How the chip draws its box. */
    public async getLook(): Promise<ChipLook> {
        const host = await this.host();
        const [background, borderColor, color] = await Promise.all([
            host.getCssValue('background-color'),
            host.getCssValue('border-top-color'),
            host.getCssValue('color'),
        ]);

        return { background, borderColor, color };
    }

    /** Whether the chip has focus, which it never takes, since it is not a control. */
    public async isFocused(): Promise<boolean> {
        return await (await this.host()).isFocused();
    }
}
