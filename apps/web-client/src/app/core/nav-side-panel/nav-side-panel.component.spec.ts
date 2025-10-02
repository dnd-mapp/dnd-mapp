import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { setupEnvironment } from '@dnd-mapp/shared-ui/test';
import { NavSidePanelHarness } from '@dnd-mapp/web-client/test';
import { NavSidePanelComponent } from './nav-side-panel.component';

describe('NavSidePanelComponent', () => {
    @Component({
        template: `<dma-nav-side-panel />`,
        imports: [NavSidePanelComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: NavSidePanelHarness,
            providers: [provideRouter([])],
        });

        return {
            harness: harness,
        };
    }

    it('should render', async () => {
        const { harness } = await setupTest();
        expect(harness).toBeDefined();
    });
});
