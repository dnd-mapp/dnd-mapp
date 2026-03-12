import { ComponentHarness } from '@angular/cdk/testing';

export class NavBrandHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-nav-brand';

    public async label() {
        return await (await this.host()).text();
    }
}
