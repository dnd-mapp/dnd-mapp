import { booleanAttribute, computed, DestroyRef, Directive, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Directive({
    selector: '[dmaToggle]',
})
export class ToggleDirective {
    private readonly destroyRef = inject(DestroyRef);

    public readonly enabled = input(false, { transform: booleanAttribute, alias: 'dmaToggle' });

    public readonly isEnabled = signal(true);

    public readonly selected = input(false, { transform: booleanAttribute });

    public readonly selectedChange = output<boolean>();

    public readonly enabledChange = output<boolean>();

    public readonly isSelected = signal(false);

    public readonly disabled = computed(() => !this.isEnabled());

    constructor() {
        toObservable(this.enabled)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (enabled) => this.isEnabled.set(enabled),
            });

        toObservable(this.selected)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (selected) => this.isSelected.set(selected),
            });
    }

    public toggle() {
        if (this.disabled()) return;
        this.isSelected.update((selected) => !selected);
        this.selectedChange.emit(this.isSelected());
    }

    public enable() {
        this.setEnabledState(true);
    }

    public disable() {
        this.setEnabledState(false);
    }

    private setEnabledState(enabled: boolean) {
        this.isEnabled.set(enabled);
    }
}
