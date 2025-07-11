import { Component } from '@angular/core';
import { createTestEnvironment, SideBarHarness } from '@dnd-mapp/shared-ui/test';
import { SideBarComponent } from './side-bar.component';

describe('SideBarComponent', () => {
    @Component({
        template: `<dma-side-bar />`,
        imports: [SideBarComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: SideBarHarness,
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
