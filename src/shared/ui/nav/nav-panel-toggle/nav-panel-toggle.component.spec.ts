import { provideNavPanel } from '@/shared-ui';
import {
    loadTestingTranslations,
    NavPanelToggleHarness,
    provideHttpTesting,
    setupTestEnvironment,
    SidePanelHarness,
} from '@/test';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NavPanelToggleComponent } from './nav-panel-toggle.component';

describe('NavPanelToggleComponent', () => {
    @Component({
        template: `<p>noop works</p>`,
    })
    class NoopComponent {}

    @Component({
        template: `<dma-nav-panel-toggle />`,
        imports: [NavPanelToggleComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness, documentRootLoader } = await setupTestEnvironment({
            testComponent: TestComponent,
            harness: NavPanelToggleHarness,
            providers: [provideRouter([]), provideHttpTesting(), provideNavPanel(NoopComponent)],
            beforeCreateComponent: async () => {
                await loadTestingTranslations();
            },
        });

        return {
            harness: harness!,
            documentRootLoader: documentRootLoader!,
        };
    }

    it('should open the side panel', async () => {
        const { harness, documentRootLoader } = await setupTest();

        let sidePanelHarness = await documentRootLoader.getHarnessOrNull(SidePanelHarness);

        expect(sidePanelHarness).toEqual(null);

        await harness.openSidePanel();

        sidePanelHarness = await documentRootLoader.getHarnessOrNull(SidePanelHarness);

        expect(sidePanelHarness).not.toEqual(null);
    });
});
