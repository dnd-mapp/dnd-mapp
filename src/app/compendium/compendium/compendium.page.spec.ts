import { CompendiumHarness, setupTestEnvironment } from '@/test';
import { Component } from '@angular/core';
import { CompendiumPage } from './compendium.page';

describe('CompendiumPage', () => {
    @Component({
        template: `<dma-compendium />`,
        imports: [CompendiumPage],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({
            testComponent: TestComponent,
            harness: CompendiumHarness,
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
