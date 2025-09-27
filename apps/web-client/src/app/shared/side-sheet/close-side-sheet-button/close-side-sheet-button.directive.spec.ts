import { Component } from '@angular/core';
import { CloseSideSheetButtonHarness, setupEnvironment } from '@dnd-mapp/web-client/test';
import { CloseSideSheetButtonDirective } from './close-side-sheet-button.directive';

describe('CloseSideSheetButtonDirective', () => {
    @Component({
        template: `<button type="button" dmaCloseSideSheetButton>Hello</button>`,
        imports: [CloseSideSheetButtonDirective],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: CloseSideSheetButtonHarness,
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
