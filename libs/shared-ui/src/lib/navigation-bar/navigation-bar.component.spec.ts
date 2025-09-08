import { Component } from '@angular/core';
import { createTestEnvironment, NavigationBarHarness } from '@dnd-mapp/shared-ui/test';
import { NavigationBarComponent } from './navigation-bar.component';

describe('NavigationBarComponent', () => {
    @Component({
        imports: [NavigationBarComponent],
        template: `<dma-navigation-bar></dma-navigation-bar>`,
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: NavigationBarHarness,
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
