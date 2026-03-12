import { loadTestingTranslations, provideHttpTesting, RootHarness, setupTestEnvironment } from '@/test';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from '../config';
import { RootComponent } from './root.component';

describe('RootComponent', () => {
    @Component({
        template: `<dma-root />`,
        imports: [RootComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({
            testComponent: TestComponent,
            harness: RootHarness,
            providers: [provideHttpTesting(), provideRouter(routes)],
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
