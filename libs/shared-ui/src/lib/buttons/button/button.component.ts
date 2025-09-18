import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { StateDirective, StateLayerComponent } from '../../state';
import {
    buttonShapeAttribute,
    ButtonSize,
    buttonSizeAttribute,
    ButtonType,
    buttonTypeAttribute,
    ButtonTypes,
    DEFAULT_BUTTON_SHAPE,
    DEFAULT_BUTTON_SIZE,
    DEFAULT_BUTTON_TYPE,
} from '../models';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'button[dmaButton]',
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [StateDirective],
    host: {
        '[attr.dma-button]': 'type()',
        '[attr.dma-button-size]': 'buttonSize()',
        '[attr.dma-button-shape]': 'shape()',
        '[attr.dma-toggle-button]': 'isToggleable()',
        '[attr.disabled]': 'isDisabled()',
        '[class.selected]': 'selectedStyle()',
        '(click)': 'onClick()',
    },
    imports: [StateLayerComponent],
})
export class ButtonComponent {
    private readonly destroyRef = inject(DestroyRef);

    public readonly type = input(DEFAULT_BUTTON_TYPE, { transform: buttonTypeAttribute, alias: 'dmaButton' });

    // eslint-disable-next-line @angular-eslint/no-input-rename
    public readonly size = input(DEFAULT_BUTTON_SIZE, { transform: buttonSizeAttribute, alias: 'dmaButtonSize' });

    // eslint-disable-next-line @angular-eslint/no-input-rename
    public readonly shape = input(DEFAULT_BUTTON_SHAPE, { transform: buttonShapeAttribute, alias: 'dmaButtonShape' });

    public readonly toggleable = input(false, { transform: booleanAttribute });

    public readonly isToggleable = signal(false);

    public readonly selected = input(false, { transform: booleanAttribute });

    public readonly disabled = input(false, { transform: booleanAttribute });

    public readonly buttonSize = signal<ButtonSize>(DEFAULT_BUTTON_SIZE);

    public readonly selectedChange = output<boolean>();

    protected readonly isDisabled = computed(() => (this.disabled() ? '' : undefined));

    private readonly isSelected = signal(false);

    public readonly selected$ = toObservable(this.isSelected).pipe(takeUntilDestroyed(this.destroyRef));

    protected readonly isToggleButton = computed(() =>
        this.isToggleable() && this.type() !== ButtonTypes.TEXT ? '' : undefined
    );

    protected readonly selectedStyle = computed(
        () => this.isSelected() && this.isToggleable() && this.type() !== ButtonTypes.TEXT
    );

    protected readonly stateLayerColor = computed(() =>
        this.getStateLayerColor(this.type(), this.isToggleable(), this.selectedStyle())
    );

    constructor() {
        toObservable(this.size)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (size) => this.buttonSize.set(size),
            });

        toObservable(this.toggleable)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (toggleable) => this.isToggleable.set(toggleable),
            });

        toObservable(this.selected)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (selected) => this.isSelected.set(selected),
            });
    }

    public toggle() {
        this.isSelected.update((selected) => !selected);
    }

    protected onClick() {
        if (!this.isToggleable()) return;
        this.isSelected.update((selected) => !selected);
        this.selectedChange.emit(this.isSelected());
    }

    private getStateLayerColor(type: ButtonType, toggleable: boolean, selected: boolean) {
        switch (type) {
            case ButtonTypes.ELEVATED:
                if (toggleable && selected) return 'on-primary';
                return 'primary';

            case ButtonTypes.TONAL:
                if (toggleable && selected) return 'on-secondary';
                return 'on-secondary-container';

            case ButtonTypes.OUTLINED:
                if (toggleable && selected) return 'on-inverse-surface';
                return 'on-surface-variant';

            case ButtonTypes.TEXT:
                return 'primary';

            default:
                if (toggleable && selected) return 'on-surface-variant';
                return 'on-primary';
        }
    }
}
