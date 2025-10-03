import { Component } from '@angular/core';
import { NotFoundHarness } from '@dnd-mapp/resources-client/test';
import { setupEnvironment } from '@dnd-mapp/shared-ui/test';
import { NotFoundPage } from './not-found.page';

describe('NotFoundPage', () => {
    @Component({
        template: `<dma-not-found />`,
        imports: [NotFoundPage],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: NotFoundHarness,
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
