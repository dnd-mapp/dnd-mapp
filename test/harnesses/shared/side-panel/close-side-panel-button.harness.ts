import { ComponentHarness } from '@angular/cdk/testing';
import { ButtonHarness } from '../button.harness';

export class CloseSidePanelButtonHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-close-side-panel-button';

    private readonly buttonLocator = this.locatorFor(ButtonHarness);

    public async click() {
        await (await this.buttonLocator()).click();
    }
}
