import { ComponentHarness } from '@angular/cdk/testing';
import { TooltipHarness } from './tooltip.harness';

export class TooltipAnchorHarness extends ComponentHarness {
    public static readonly hostSelector = '[dmaTooltipAnchor]';

    private readonly tooltipLocator = this.documentRootLocatorFactory().locatorForOptional(TooltipHarness);

    public async hover() {
        await (await this.host()).hover();
    }

    public async mouseAway() {
        await (await this.host()).mouseAway();
    }

    public async tooltipPresent() {
        return Boolean(await this.tooltipLocator());
    }

    public async tooltipVisible() {
        const tooltip = await this.tooltipLocator();

        if (!tooltip) return false;
        return (await tooltip.opacity()) === '1';
    }

    public async tooltipLabel() {
        return await (await this.tooltipLocator())!.label();
    }
}
