import { Component } from '@angular/core';
import { setupEnvironment } from '@dnd-mapp/shared-ui/test';
import { HomeHarness } from '@dnd-mapp/web-client/test';
import { HomePage } from './home.page';

describe('HomePage', () => {
    @Component({
        template: `<dma-home />`,
        imports: [HomePage],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: HomeHarness,
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
