import { Component } from '@angular/core';
import { OptionHarness, setupEnvironment } from '@dnd-mapp/shared-ui/test';
import { OptionComponent } from './option.component';

describe('OptionComponent', () => {
    @Component({
        template: `<dma-option [value]="1">my Label</dma-option>`,
        imports: [OptionComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: OptionHarness,
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
