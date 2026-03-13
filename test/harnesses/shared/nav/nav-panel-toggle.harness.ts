import { ComponentHarness } from '@angular/cdk/testing';
import { ButtonHarness } from '../button.harness';

export class NavPanelToggleHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-nav-panel-toggle';

    private readonly buttonLocator = this.locatorFor(ButtonHarness);

    public async openSidePanel() {
        await (await this.buttonLocator()).click();
    }
}
