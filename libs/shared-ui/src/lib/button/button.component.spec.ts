import { Component } from '@angular/core';
import { ButtonHarness, setupEnvironment } from '@dnd-mapp/shared-ui/test';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
    @Component({
        template: `<button type="button" dmaButton>My button label</button>`,
        imports: [ButtonComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: ButtonHarness,
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
