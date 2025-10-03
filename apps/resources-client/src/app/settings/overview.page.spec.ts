import { Component } from '@angular/core';
import { SettingsOverviewHarness } from '@dnd-mapp/resources-client/test';
import { setupEnvironment } from '@dnd-mapp/shared-ui/test';
import { OverviewPage } from './overview.page';

describe('OverviewPage', () => {
    @Component({
        template: `<dma-settings-overview />`,
        imports: [OverviewPage],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: SettingsOverviewHarness,
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
