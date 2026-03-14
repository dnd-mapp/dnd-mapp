import { HomeHarness, loadTestingTranslations, provideHttpTesting, setupTestEnvironment } from '@/test';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
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
            providers: [provideRouter([]), provideHttpTesting()],
            beforeCreateComponent: async () => {
                await loadTestingTranslations();
            },
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
