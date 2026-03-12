import { ComponentHarness } from '@angular/cdk/testing';
import { AngleLeftHarness, AngleRightHarness } from '../../icons/solid';

export class NavRailToggleHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-nav-rail-toggle';

    private readonly angleLeftLocator = this.locatorForOptional(AngleLeftHarness);
    private readonly angleRightLocator = this.locatorForOptional(AngleRightHarness);

    public async toggle() {
        await (await this.host()).click();
    }

    public async isCollapsed() {
        return Boolean(await this.angleRightLocator());
    }

    public async isExpanded() {
        return Boolean(await this.angleLeftLocator());
    }
}
