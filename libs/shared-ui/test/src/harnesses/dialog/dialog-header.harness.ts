import { ComponentHarness } from '@angular/cdk/testing';
import { CloseDialogButtonHarness } from './close-dialog-button.harness';

export class DialogHeaderHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-dialog-header';

    private readonly titleLocator = this.locatorFor('.dma-dialog-title');
    private readonly closeDialogButtonLocator = this.locatorFor(CloseDialogButtonHarness);

    public async dismissDialog() {
        await (await this.closeDialogButtonLocator()).click();
    }

    public async getTitle() {
        return await (await this.titleLocator()).text();
    }
}
