import { AppTopBarHarness, loadTestingTranslations, provideHttpTesting, setupTestEnvironment } from '@/test';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNavPanel } from '../provide-nav-panel';
import { AppTopBarComponent } from './app-top-bar.component';

describe('AppTopBarComponent', () => {
    @Component({
        template: `<p>noop works!</p>`,
    })
    class NoopComponent {}

    @Component({
        template: `<dma-app-top-bar />`,
        imports: [AppTopBarComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({
            testComponent: TestComponent,
            harness: AppTopBarHarness,
            providers: [provideRouter([]), provideHttpTesting(), provideNavPanel(NoopComponent)],
            beforeCreateComponent: async () => {
                await loadTestingTranslations();
            },
        });

        return {
            harness: harness,
        };
    }

    it('should create', async () => {
        const { harness } = await setupTest();
        expect(harness).toBeDefined();
    });
});
