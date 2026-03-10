import { NotFoundHarness, setupTestEnvironment } from '@/test';
import { Component } from '@angular/core';
import { NotFoundPage } from './not-found.page';

describe('NotFoundPage', () => {
    @Component({
        template: `<dma-not-found />`,
        imports: [NotFoundPage],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({
            testComponent: TestComponent,
            harness: NotFoundHarness,
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
