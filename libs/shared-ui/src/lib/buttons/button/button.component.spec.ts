import { booleanAttribute, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
    buttonShapeAttribute,
    buttonSizeAttribute,
    buttonTypeAttribute,
    DEFAULT_BUTTON_SHAPE,
    DEFAULT_BUTTON_SIZE,
    DEFAULT_BUTTON_TYPE,
} from '@dnd-mapp/shared-ui';
import { ButtonHarness, createTestEnvironment } from '@dnd-mapp/shared-ui/test';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
    @Component({
        imports: [ButtonComponent],
        template: `<button
            [dmaButton]="type()"
            [dmaButtonSize]="size()"
            [dmaButtonShape]="shape()"
            [toggleable]="toggle()"
            [selected]="isSelected()"
            (selectedChange)="onSelectedChange($event)"
        >
            {{ label() }}
        </button>`,
    })
    class TestComponent {
        private readonly destroyRef = inject(DestroyRef);

        public readonly label = input('My button label');

        public readonly type = input(DEFAULT_BUTTON_TYPE, { transform: buttonTypeAttribute });

        public readonly size = input(DEFAULT_BUTTON_SIZE, { transform: buttonSizeAttribute });

        public readonly shape = input(DEFAULT_BUTTON_SHAPE, { transform: buttonShapeAttribute });

        public readonly toggle = input(false, { transform: booleanAttribute });

        public readonly selected = input(false, { transform: booleanAttribute });

        private readonly isSelected = signal(false);

        public selectedChanged = false;

        constructor() {
            toObservable(this.selected)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (selected) => this.isSelected.set(selected),
                });
        }

        protected onSelectedChange(selected: boolean) {
            this.isSelected.set(selected);
            this.selectedChanged = true;
        }
    }

    async function setupTest() {
        const { harness } = await createTestEnvironment({
            testComponent: TestComponent,
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
