import { Component } from '@angular/core';
import { ResourcesListHarness } from '@dnd-mapp/resources-client/test';
import { setupEnvironment } from '@dnd-mapp/shared-ui/test';
import { ResourcesListComponent } from './resources-list.component';

describe('ResourcesListComponent', () => {
    @Component({
        template: `<dma-resources-list></dma-resources-list>`,
        imports: [ResourcesListComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: ResourcesListHarness,
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
