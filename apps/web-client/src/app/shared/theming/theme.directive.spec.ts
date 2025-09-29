import { Component } from '@angular/core';
import { setupEnvironment, ThemeHarness } from '@dnd-mapp/web-client/test';
import { ThemeDirective } from './theme.directive';

describe('ThemeDirective', () => {
    @Component({
        template: `<div dmaTheme>Hello</div>`,
        imports: [ThemeDirective],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: ThemeHarness,
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
