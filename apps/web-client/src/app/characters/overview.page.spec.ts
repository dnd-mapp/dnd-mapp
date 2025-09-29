import { Component } from '@angular/core';
import { CharactersOverviewHarness, setupEnvironment } from '@dnd-mapp/web-client/test';
import { OverviewPage } from './overview.page';

describe('OverviewPage', () => {
    @Component({
        template: `<dma-characters-overview />`,
        imports: [OverviewPage],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: CharactersOverviewHarness,
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
