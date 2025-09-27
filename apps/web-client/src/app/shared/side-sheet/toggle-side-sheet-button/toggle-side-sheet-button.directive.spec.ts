import { Component } from '@angular/core';
import { setupEnvironment, ToggleSideSheetButtonHarness } from '@dnd-mapp/web-client/test';
import { ToggleSideSheetButtonDirective } from './toggle-side-sheet-button.directive';

describe('ToggleSideSheetButtonDirective', () => {
    @Component({
        template: `<button type="button" dmaToggleSideSheetButton>Hello</button>`,
        imports: [ToggleSideSheetButtonDirective],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: ToggleSideSheetButtonHarness,
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
