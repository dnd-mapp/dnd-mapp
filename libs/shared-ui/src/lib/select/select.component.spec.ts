import { Component } from '@angular/core';
import { SelectHarness, setupEnvironment } from '@dnd-mapp/shared-ui/test';
import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
    @Component({
        template: `<dma-select></dma-select>`,
        imports: [SelectComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: SelectHarness,
        });

        return {
            harness: harness,
        };
    }

    it('should create', async () => {
        const { harness } = await setupTest();
        expect(harness).toBeDefined();
    });
});
