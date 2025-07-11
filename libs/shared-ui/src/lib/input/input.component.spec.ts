import { Component } from '@angular/core';
import { createTestEnvironment, InputHarness } from '@dnd-mapp/shared-ui/test';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
    @Component({
        template: `<dma-input type="text" label="My label" />`,
        imports: [InputComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: InputHarness,
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
