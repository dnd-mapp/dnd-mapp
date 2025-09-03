import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    effect,
    ExistingProvider,
    forwardRef,
    input,
    output,
    signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckIcon } from '../icons';

const provideControlValueAccessor: () => ExistingProvider = () => ({
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true,
});

@Component({
    selector: 'dma-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideControlValueAccessor()],
    imports: [CheckIcon],
})
export class CheckboxComponent implements ControlValueAccessor {
    public readonly label = input.required<string>();

    public readonly checked = input(false, { transform: booleanAttribute });

    public readonly disabled = input(false, { transform: booleanAttribute });

    public readonly checkedChange = output<boolean>();

    protected readonly isChecked = signal(false);

    protected readonly isDisabled = signal(false);

    private onTouched: () => void;

    private onChanged: (checked: boolean) => void;

    constructor() {
        effect(() => this.isChecked.set(this.checked()));
        effect(() => {
            if (this.isDisabled()) return;
            this.isDisabled.set(this.disabled());
        });
    }

    public writeValue(checked: boolean) {
        this.isChecked.set(checked);
    }

    public registerOnChange(fn: (checked: boolean) => void) {
        this.onChanged = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean) {
        this.isDisabled.set(isDisabled);
    }

    protected toggleChecked() {
        if (this.isDisabled()) return;
        this.isChecked.set(!this.isChecked());
        this.checkedChange.emit(!this.checked());
        this.onTouched();
        this.onChanged(this.isChecked());
    }
}
