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
    buttonSizeAttribute,
    ButtonType,
    buttonTypeAttribute,
    ButtonTypes,
    DEFAULT_BUTTON_SHAPE,
    DEFAULT_BUTTON_SIZE,
    DEFAULT_BUTTON_TYPE,
} from './models';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'button[dmaButton]',
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [StateDirective],
    host: {
        '[attr.dma-button]': 'type()',
        '[attr.dma-button-size]': 'size()',
        '[attr.dma-button-shape]': 'shape()',
        '[attr.dma-toggle-button]': 'isToggleButton()',
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

    public readonly toggle = input(false, { transform: booleanAttribute });

    public readonly selected = input(false, { transform: booleanAttribute });

    public readonly disabled = input(false, { transform: booleanAttribute });

    protected readonly isDisabled = computed(() => (this.disabled() ? '' : undefined));

    public readonly selectedChange = output<boolean>();

    protected readonly isToggleButton = computed(() =>
        this.toggle() && this.type() !== ButtonTypes.TEXT ? '' : undefined
    );

    protected readonly selectedStyle = computed(
        () => this.isSelected() && this.toggle() && this.type() !== ButtonTypes.TEXT
    );

    protected readonly stateLayerColor = computed(() =>
        this.getStateLayerColor(this.type(), this.toggle(), this.selectedStyle())
    );

    private readonly isSelected = signal(false);

    constructor() {
        toObservable(this.selected)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (selected) => this.isSelected.set(selected),
            });
    }

    protected onClick() {
        if (!this.toggle()) return;
        this.isSelected.update((selected) => !selected);
        this.selectedChange.emit(this.isSelected());
    }

    private getStateLayerColor(type: ButtonType, toggle: boolean, selected: boolean) {
        switch (type) {
            case ButtonTypes.ELEVATED:
                if (toggle && selected) return 'on-primary';
                return 'primary';

            case ButtonTypes.TONAL:
                if (toggle && selected) return 'on-secondary';
                return 'on-secondary-container';

            case ButtonTypes.OUTLINED:
                if (toggle && selected) return 'on-inverse-surface';
                return 'on-surface-variant';

            case ButtonTypes.TEXT:
                return 'primary';

            default:
                if (toggle && selected) return 'on-surface-variant';
                return 'on-primary';
        }
    }
}
