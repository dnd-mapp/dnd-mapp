import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    inject,
    input,
    output,
    signal,
    viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
    selector: 'dma-option',
    templateUrl: './option.component.html',
    styleUrl: './option.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.selected]': 'isSelected()',
        '(click)': 'onSelect()',
    },
    imports: [],
})
export class OptionComponent<T = unknown> {
    private readonly destroyRef = inject(DestroyRef);

    public readonly value = input.required<T>();

    public readonly selected = input(false);

    public readonly selectedChange = output<boolean>();

    public readonly label = computed(() => this.labelElementRef().nativeElement.textContent);

    public readonly isSelected = signal(false);

    private readonly labelElementRef = viewChild.required<ElementRef<HTMLElement>>('label');

    constructor() {
        toObservable(this.selected)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (selected) => this.isSelected.set(selected),
            });

        // Emit when the `selected` state is set to `false` from outside the component.
        toObservable(this.isSelected)
            .pipe(
                filter((selected) => !selected),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
                next: (selected) => this.selectedChange.emit(selected),
            });
    }

    protected onSelect() {
        if (this.isSelected()) return;
        this.isSelected.set(true);
        this.selectedChange.emit(true);
    }
}
