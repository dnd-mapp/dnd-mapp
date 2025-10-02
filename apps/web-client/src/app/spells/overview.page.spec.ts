import { Component } from '@angular/core';
import { setupEnvironment } from '@dnd-mapp/shared-ui/test';
import { SpellsOverviewHarness } from '@dnd-mapp/web-client/test';
import { OverviewPage } from './overview.page';

describe('OverviewPage', () => {
    @Component({
        template: `<dma-spells-overview />`,
        imports: [OverviewPage],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: SpellsOverviewHarness,
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
