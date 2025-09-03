import { ComponentHarness } from '@angular/cdk/testing';

export class TooltipHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-tooltip';

    public async isVisible() {
        return (await (await this.host()).getCssValue('opacity')) === '1';
    }

    public async label() {
        return await (await this.host()).text();
    }

    public async hover() {
        await (await this.host()).hover();
    }

    public async mouseAway() {
        await (await this.host()).mouseAway();
    }
}
