import { HomeHarness, setupTestEnvironment } from '@/test';
import { Component } from '@angular/core';
import { HomePage } from './home.page';

describe('HomePage', () => {
    @Component({
        template: `<dma-home />`,
        imports: [HomePage],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({
            testComponent: TestComponent,
            harness: HomeHarness,
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
