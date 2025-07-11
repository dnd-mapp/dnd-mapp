import { ComponentHarness } from '@angular/cdk/testing';

export class NavigationLinkHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-navigation-link';

    private readonly anchorLocator = this.locatorFor('a');

    public async getRoute() {
        return await (await this.anchorLocator()).getAttribute('href');
    }

    public async navigateToRoute() {
        await (await this.anchorLocator()).click();
    }
}
