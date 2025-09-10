import { Component } from '@angular/core';
import { createTestEnvironment, StateHarness, StateLayerHarness } from '@dnd-mapp/shared-ui/test';
import { StateLayerComponent } from './state-layer.component';
import { StateDirective } from './state.directive';

describe('StateDirective', () => {
    @Component({
        imports: [StateLayerComponent, StateDirective],
        template: `<div dmaState><dma-state-layer color="FF00FF" /></div>`,
    })
    class TestComponent {}

    async function setupTest() {
        const { harness: stateLayerHarness, harnessLoader } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: StateLayerHarness,
        });

        const stateHarness = await harnessLoader.getHarness(StateHarness);

        return {
            stateLayerHarness: stateLayerHarness,
            stateHarness: stateHarness,
        };
    }

    it('should render', async () => {
        const { stateLayerHarness } = await setupTest();
        expect(stateLayerHarness).toBeDefined();
    });
});
