import { ChangeDetectionStrategy, Component, contentChildren, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { map, merge, switchMap } from 'rxjs';
import { ButtonComponent } from '../button';
import { buttonSizeAttribute, DEFAULT_BUTTON_SIZE } from '../models';

@Component({
    selector: 'dma-button-group',
    templateUrl: './button-group.component.html',
    styleUrl: './button-group.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[attr.dma-button-size]': 'size()',
    },
    imports: [],
})
export class ButtonGroupComponent<T = unknown> {
    private readonly destroyRef = inject(DestroyRef);

    // eslint-disable-next-line @angular-eslint/no-input-rename
    public readonly size = input(DEFAULT_BUTTON_SIZE, { transform: buttonSizeAttribute, alias: 'dmaButtonSize' });

    public readonly value = input<T>(null);

    public readonly valueChange = output<T>();

    private readonly buttons = contentChildren(ButtonComponent);

    private selectedOption: ButtonComponent = null;

    constructor() {
        toObservable(this.buttons)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (buttons) => this.setButtonSize([...buttons]),
            });

        toObservable(this.buttons)
            .pipe(
                switchMap((buttons) =>
                    merge(
                        ...buttons.map((button) =>
                            button.selected$.pipe(map((selected) => ({ button: button, selected: selected })))
                        )
                    )
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: ({ button, selected }) => this.setSelectedOption(button, selected),
            });
    }

    private setButtonSize(buttons: ButtonComponent[]) {
        buttons.forEach((button) => button.buttonSize.set(this.size()));
    }

    private setSelectedOption(buttonComponent: ButtonComponent, selected: boolean) {
        if (!selected) {
            if (this.selectedOption === buttonComponent) this.selectedOption.toggle();
            return;
        }
        if (this.selectedOption === buttonComponent) return;
        if (this.selectedOption) this.selectedOption.toggle();
        this.selectedOption = buttonComponent;
    }
}
