import { loadTestingTranslations, NavHarness, provideHttpTesting, setupTestEnvironment } from '@/test';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NavComponent } from './nav.component';

describe('NavComponent', () => {
    @Component({
        template: `<dma-nav />`,
        imports: [NavComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({
            testComponent: TestComponent,
            harness: NavHarness,
            providers: [provideRouter([]), provideHttpTesting()],
            beforeCreateComponent: async () => {
                await loadTestingTranslations();
            },
        });

        return {
            harness: harness!,
        };
    }

    it('should create', async () => {
        const { harness } = await setupTest();
        expect(harness).toBeDefined();
    });
});
