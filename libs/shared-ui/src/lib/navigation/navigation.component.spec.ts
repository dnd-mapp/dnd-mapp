import { Component } from '@angular/core';
import { createTestEnvironment, NavigationHarness } from '@dnd-mapp/shared-ui/test';
import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
    @Component({
        template: `<dma-navigation />`,
        imports: [NavigationComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: NavigationHarness,
        });

        return {
            harness: harness,
        };
    }

    it('should create', async () => {
        const { harness } = await setupTest();
        expect(harness).not.toBeNull();
    });
});
