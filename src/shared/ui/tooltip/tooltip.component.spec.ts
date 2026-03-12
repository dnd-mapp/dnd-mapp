import { setupTestEnvironment, TooltipHarness } from '@/test';
import { Component } from '@angular/core';
import { TooltipComponent } from './tooltip.component';

describe('TooltipComponent', () => {
    @Component({
        template: `<dma-tooltip label="My tooltip" />`,
        imports: [TooltipComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({
            testComponent: TestComponent,
            harness: TooltipHarness,
        });

        return {
            harness: harness!,
        };
    }

    it('should show label', async () => {
        const { harness } = await setupTest();

        expect(await harness.label()).toEqual('My tooltip');
    });
});
