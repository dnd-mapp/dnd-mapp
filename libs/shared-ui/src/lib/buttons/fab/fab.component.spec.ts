import { booleanAttribute, Component, input } from '@angular/core';
import {
    DEFAULT_FAB_COLOR,
    DEFAULT_FAB_SIZE,
    fabColorAttribute,
    fabSizeAttribute,
    PenToSquareSoIcon,
} from '@dnd-mapp/shared-ui';
import { createTestEnvironment } from '@dnd-mapp/shared-ui/test';
import { FabHarness } from '../../../../test/src/harnesses/buttons/fab.harness';
import { FabComponent } from './fab.component';

describe('FabComponent', () => {
    @Component({
        imports: [PenToSquareSoIcon, FabComponent],
        template: `<button
            type="button"
            [dmaFab]="color()"
            [dmaFabSize]="size()"
            [floating]="floating()"
            [navigationBarShown]="navigationBarShown()"
        >
            <dma-icon dma-pen-to-square-so-icon />
        </button>`,
    })
    class TestComponent {
        public readonly color = input(DEFAULT_FAB_COLOR, { transform: fabColorAttribute });

        public readonly size = input(DEFAULT_FAB_SIZE, { transform: fabSizeAttribute });

        public readonly floating = input(false, { transform: booleanAttribute });

        public readonly navigationBarShown = input(false, { transform: booleanAttribute });
    }

    async function setupTest() {
        const { harness } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: FabHarness,
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
