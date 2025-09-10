import { Component } from '@angular/core';
import { BadgeTargetHarness, createTestEnvironment } from '@dnd-mapp/shared-ui/test';
import { HouseSoIcon } from '../icons';
import { BadgeTargetDirective } from './badge-target.directive';

describe('BadgeDirective', () => {
    @Component({
        imports: [HouseSoIcon, BadgeTargetDirective],
        template: `<dma-icon dma-house-so-icon dmaBadge />`,
    })
    class TestComponent {}

    async function setupTest() {
        const { harness, harnessLoader } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: BadgeTargetHarness,
        });

        return {
            harness: harness,
            harnessLoader: harnessLoader,
        };
    }

    it('should render', async () => {
        const { harness } = await setupTest();
        expect(harness).toBeDefined();
    });
});
