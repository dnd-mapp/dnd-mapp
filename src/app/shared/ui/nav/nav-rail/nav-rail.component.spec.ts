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
            harness: harness,
        };
    }

    it('should render', async () => {
        const { harness } = await setupTest();
        expect(harness).toBeDefined();
    });
});
