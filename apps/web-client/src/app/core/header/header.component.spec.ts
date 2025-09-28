import { Component } from '@angular/core';
import { HeaderHarness, setupEnvironment } from '@dnd-mapp/web-client/test';
import { HeaderComponent } from './header.component';

describe('Header', () => {
    @Component({
        template: `<dma-header />`,
        imports: [HeaderComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: HeaderHarness,
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
