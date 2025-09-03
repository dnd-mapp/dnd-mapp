import { Component } from '@angular/core';
import { CheckboxHarness, createTestEnvironment } from '@dnd-mapp/shared-ui/test';
import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
    @Component({
        template: `<dma-checkbox label="My label" />`,
        imports: [CheckboxComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: CheckboxHarness,
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
