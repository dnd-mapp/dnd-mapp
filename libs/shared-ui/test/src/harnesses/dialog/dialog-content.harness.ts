import { ComponentHarness } from '@angular/cdk/testing';

export class DialogContentHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-dialog-content';

    public async getContent() {
        return await (await this.host()).text();
    }
}
