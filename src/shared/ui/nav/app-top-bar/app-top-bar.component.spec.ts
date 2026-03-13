import { AppTopBarHarness, setupTestEnvironment } from '@/test';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AppTopBarComponent } from './app-top-bar.component';

describe('AppTopBarComponent', () => {
    @Component({
        template: `<dma-app-top-bar />`,
        imports: [AppTopBarComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({
            testComponent: TestComponent,
            harness: AppTopBarHarness,
            providers: [provideRouter([])],
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
