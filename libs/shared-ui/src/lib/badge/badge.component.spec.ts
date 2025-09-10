import { Component } from '@angular/core';
import { BadgeHarness, createTestEnvironment } from '@dnd-mapp/shared-ui/test';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
    @Component({
        template: `<dma-badge />`,
        imports: [BadgeComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: BadgeHarness,
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
