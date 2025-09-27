import { Component } from '@angular/core';
import { RootHarness, setupEnvironment } from '@dnd-mapp/web-client/test';
import { RootComponent } from './root.component';

describe('RootComponent', () => {
    @Component({
        template: `<dma-root />`,
        imports: [RootComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: RootHarness,
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
