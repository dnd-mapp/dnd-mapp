import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NavBrandHarness, setupEnvironment } from '@dnd-mapp/shared-ui/test';
import { NavBrandComponent } from './nav-brand.component';

describe('NavBrandComponent', () => {
    @Component({
        template: `<dma-nav-brand />`,
        imports: [NavBrandComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: NavBrandHarness,
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
