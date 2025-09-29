import { Component } from '@angular/core';
import { NavMenuTriggerHarness, setupEnvironment } from '@dnd-mapp/web-client/test';
import { NavMenuContainerComponent } from './nav-menu-container.component';
import { NavMenuTriggerComponent } from './nav-menu-trigger.component';

describe('NavMenuTriggerComponent', () => {
    @Component({
        template: `<dma-nav-menu-trigger label="My label">
            <dma-nav-menu-container></dma-nav-menu-container>
        </dma-nav-menu-trigger>`,
        imports: [NavMenuTriggerComponent, NavMenuContainerComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness, harnessLoader } = await setupEnvironment({
            component: TestComponent,
            harness: NavMenuTriggerHarness,
        });

        return {
            harness: harness,
            harnessLoader: harnessLoader,
        };
    }

    it('should render', async () => {
        const { harness } = await setupTest();
        expect(harness).toBeDefined();
    });
});
