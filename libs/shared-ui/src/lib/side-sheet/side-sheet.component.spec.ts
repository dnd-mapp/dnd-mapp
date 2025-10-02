import { Component } from '@angular/core';
import { setupEnvironment, SideSheetHarness } from '@dnd-mapp/shared-ui/test';
import { SideSheetComponent } from './side-sheet.component';

describe('SideSheetComponent', () => {
    @Component({
        template: `<dma-side-sheet />`,
        imports: [SideSheetComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: SideSheetHarness,
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
