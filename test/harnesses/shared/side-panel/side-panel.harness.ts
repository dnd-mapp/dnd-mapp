import { ComponentHarness } from '@angular/cdk/testing';
import { NavBrandHarness } from '../nav';
import { CloseSidePanelButtonHarness } from './close-side-panel-button.harness';

export class SidePanelHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-side-panel';

    private readonly closeSidePanelButtonLocator = this.locatorFor(CloseSidePanelButtonHarness);
    private readonly navBrandLocator = this.locatorFor(NavBrandHarness);

    public async closeSidePanel() {
        await (await this.closeSidePanelButtonLocator()).click();
    }

    public async navigateToHome() {
        await (await this.navBrandLocator()).navigateToHome();
    }
}
