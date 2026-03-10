import { CharactersOverviewHarness, setupTestEnvironment } from '@/test';
import { Component } from '@angular/core';
import { CharactersOverviewPage } from './characters-overview.page';

describe('CharactersOverviewPage', () => {
    @Component({
        template: `<dma-characters-overview />`,
        imports: [CharactersOverviewPage],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({
            testComponent: TestComponent,
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
