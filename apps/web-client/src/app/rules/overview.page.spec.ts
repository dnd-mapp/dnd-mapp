import { Component } from '@angular/core';
import { setupEnvironment } from '@dnd-mapp/shared-ui/test';
import { RulesOverviewHarness } from '@dnd-mapp/web-client/test';
import { OverviewPage } from './overview.page';

describe('OverviewPage', () => {
    @Component({
        template: `<dma-rules-overview />`,
        imports: [OverviewPage],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: RulesOverviewHarness,
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
