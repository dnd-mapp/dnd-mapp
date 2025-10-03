import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HeaderHarness } from '@dnd-mapp/resources-client/test';
import { setupEnvironment } from '@dnd-mapp/shared-ui/test';
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
            providers: [provideRouter([])],
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
