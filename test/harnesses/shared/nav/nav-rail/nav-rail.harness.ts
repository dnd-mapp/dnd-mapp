import { ComponentHarness } from '@angular/cdk/testing';
import { NavRailToggleHarness } from './nav-rail-toggle.harness';

export class NavRailHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-nav-rail';

    private readonly navRailToggleLocator = this.locatorFor(NavRailToggleHarness);

    public async toggleCollapse() {
        await (await this.navRailToggleLocator()).toggle();
    }

    public async isCollapsed() {
        return await (await this.host()).hasClass('collapsed');
    }
}
