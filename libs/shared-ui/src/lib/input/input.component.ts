import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    effect,
    ElementRef,
    forwardRef,
    inject,
    Injector,
    input,
    OnInit,
    output,
    signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { CircleExclamationIcon } from '../icons';
import {
    autocompleteAttribute,
    AutocompleteTypes,
    ErrorMap,
    floatingLabelAnimation,
    FloatingLabelAnimationState,
    FloatingLabelAnimationStates,
    inputTypeAttribute,
} from './models';

const provideControlValueAccessor = () => ({
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true,
});

@Component({
    selector: 'dma-input',
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideControlValueAccessor()],
    animations: [floatingLabelAnimation],
    imports: [CircleExclamationIcon],
})
export class InputComponent implements ControlValueAccessor, OnInit {
    private readonly injector = inject(Injector);

    public readonly type = input.required({ transform: inputTypeAttribute });

    public readonly label = input.required<string>();

    public readonly value = input<string>(null);

    public readonly placeholder = input<string>('');

    public readonly disabled = input(false, { transform: booleanAttribute });

    public readonly readonly = input(false, { transform: booleanAttribute });

    public readonly errorMap = input<ErrorMap>(null);

    public readonly autocomplete = input(AutocompleteTypes.OFF, { transform: autocompleteAttribute });

    public readonly valueChange = output<string>();

    protected readonly focused = signal(false);

    protected readonly floatingLabelState = computed<FloatingLabelAnimationState>(() =>
        this.focused() || this._value()
            ? this.hasLeadingIcon()
                ? FloatingLabelAnimationStates.FLOATING_LEADING_ICON
                : FloatingLabelAnimationStates.FLOATING
            : FloatingLabelAnimationStates.DEFAULT
    );

    protected readonly hasLeadingIcon = computed<boolean>(() => Boolean(this.leadingIcon()));

    protected readonly _value = signal<string>(null);

    protected readonly _disabled = signal<boolean>(false);

    protected onChange: (value: string) => void;

    protected onTouched: () => void;

    private ngControl: NgControl;

    private readonly leadingIcon = contentChild('leadingIcon', { read: ElementRef<unknown> });

    constructor() {
        effect(() => {
            if (this.value() === null) return;
            this._value.set(this.value());
        });

        effect(() => {
            if (this.disabled() === null) return;
            this._disabled.set(this.disabled());
        });
    }

    public ngOnInit() {
        this.ngControl = this.injector.get(NgControl, null, { optional: true, self: true });
    }

    public writeValue(value: string) {
        this._value.set(value);
    }

    public registerOnChange(fn: (value: string) => void) {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    public setDisabledState(disabled: boolean) {
        this._disabled.set(disabled);
    }

    protected hasErrors(errorCode?: string) {
        if (!this.ngControl) return false;
        return (
            this.ngControl.touched &&
            (errorCode ? Boolean(this.ngControl.hasError(errorCode)) : Boolean(this.ngControl.errors))
        );
    }

    protected get errorMessage() {
        if (!this.hasErrors() || !this.errorMap()) return null;

        if (this.hasErrors('required')) {
            return this.errorMap()['required']();
        }
        if (this.hasErrors('email')) {
            return this.errorMap()['email']();
        }
        if (this.hasErrors('minlength')) {
            return this.errorMap()['minlength']();
        }
        return null;
    }

    protected get isRequired() {
        return this.ngControl?.control.hasValidator(Validators.required);
    }

    protected onFocus() {
        this.focused.set(true);
    }

    protected onBlur() {
        this.focused.set(false);
        this.onTouched();
    }

    protected onInput(value: string) {
        this._value.set(value);

        this.onChange(value);
        this.onTouched();

        this.valueChange.emit(value);
    }
}
