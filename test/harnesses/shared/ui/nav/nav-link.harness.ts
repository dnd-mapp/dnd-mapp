import { ComponentHarness } from '@angular/cdk/testing';

export class NavLinkHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-nav-link';

    private readonly anchorLocator = this.locatorFor('a');

    public async navigate() {
        await (await this.anchorLocator()).click();
    }

    public async label() {
        return await (await this.host()).text();
    }

    public async isActive() {
        return await (await this.host()).hasClass('active');
    }
}
