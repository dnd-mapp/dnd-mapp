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
import {
    buttonShapeAttribute,
    buttonSizeAttribute,
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
    host: {
        '[attr.dma-button]': 'type()',
        '[attr.dma-button-size]': 'size()',
        '[attr.dma-button-shape]': 'shape()',
        '[attr.dma-toggle-button]': 'isToggleButton()',
        '[class.selected]': 'selectedStyle()',
        '(click)': 'onClick()',
    },
    imports: [],
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

    public readonly selectedChange = output<boolean>();

    protected readonly isToggleButton = computed(() =>
        this.toggle() && this.type() !== ButtonTypes.TEXT ? '' : undefined
    );

    protected readonly selectedStyle = computed(
        () => this.isSelected() && this.toggle() && this.type() !== ButtonTypes.TEXT
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
}
