import { ComponentHarness } from '@angular/cdk/testing';
import { TooltipHarness } from './tooltip.harness';

export class TooltipAnchorHarness extends ComponentHarness {
    public static readonly hostSelector = '[dmaTooltip]';

    private tooltipLocator = this.documentRootLocatorFactory().locatorForOptional(TooltipHarness);
    private cdkOverlayLocator = this.documentRootLocatorFactory().locatorForOptional('.cdk-overlay-pane');

    public async isTooltipAdded() {
        return Boolean(await this.tooltipLocator());
    }

    public async isTooltipVisible() {
        return await (await this.tooltipLocator()).isVisible();
    }

    public async tooltipIsPositionedAt(position: string) {
        return await (await this.cdkOverlayLocator()).hasClass(`dma-tooltip-${position}`);
    }

    public async getTooltipLabel() {
        return await (await this.tooltipLocator()).label();
    }

    public async hoverOverAnchor() {
        await (await this.host()).hover();
    }

    public async hoverOverTooltip() {
        await (await this.tooltipLocator()).hover();
    }

    public async mouseAwayFromAnchor() {
        await (await this.host()).mouseAway();
    }

    public async mouseAwayFromTooltip() {
        await (await this.tooltipLocator()).mouseAway();
    }
}
