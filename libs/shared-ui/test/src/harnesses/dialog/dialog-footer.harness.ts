import { ComponentHarness } from '@angular/cdk/testing';
import { ButtonHarness } from '../button.harness';

export class DialogFooterHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-dialog-footer';

    private readonly cancelButtonLocator = this.locatorForOptional(ButtonHarness.with({ type: 'secondary' }));

    public async cancel() {
        await (await this.cancelButtonLocator()).click();
    }
}
