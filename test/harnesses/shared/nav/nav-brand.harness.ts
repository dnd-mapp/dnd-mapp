import { ComponentHarness } from '@angular/cdk/testing';

export class NavBrandHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-nav-brand';

    private readonly anchorLocator = this.locatorFor('a');

    public async navigateToHome() {
        await (await this.anchorLocator()).click();
    }

    public async label() {
        return await (await this.host()).text();
    }
}
