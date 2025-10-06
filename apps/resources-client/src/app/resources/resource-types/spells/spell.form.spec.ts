import { Component } from '@angular/core';
import { SpellHarness } from '@dnd-mapp/resources-client/test';
import { setupEnvironment } from '@dnd-mapp/shared-ui/test';
import { SpellForm } from './spell.form';

describe('SpellForm', () => {
    @Component({
        template: `<dma-spell-form />`,
        imports: [SpellForm],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: SpellHarness,
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
