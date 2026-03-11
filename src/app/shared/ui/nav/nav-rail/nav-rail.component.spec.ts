import { NavRailHarness, setupTestEnvironment } from '@/test';
import { Component } from '@angular/core';
import { NavRailComponent } from './nav-rail.component';

describe('NavRailComponent', () => {
    @Component({
        template: `<dma-nav-rail></dma-nav-rail>`,
        imports: [NavRailComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({
            testComponent: TestComponent,
            harness: NavRailHarness,
        });

        return {
            harness: harness!,
        };
    }

    it('should toggle collapsed state', async () => {
        const { harness } = await setupTest();

        expect(await harness.isCollapsed()).toEqual(false);

        await harness.toggleCollapse();

        expect(await harness.isCollapsed()).toEqual(true);
    });
});
