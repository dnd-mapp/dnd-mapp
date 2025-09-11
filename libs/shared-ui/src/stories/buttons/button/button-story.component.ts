import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
    ButtonComponent,
    buttonShapeAttribute,
    buttonSizeAttribute,
    buttonTypeAttribute, PlusSoIcon,
    ThemeDirective,
} from '@dnd-mapp/shared-ui';

@Component({
    selector: 'dma-story',
    templateUrl: './button-story.component.html',
    styleUrl: './button-story.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [ThemeDirective],
    imports: [ButtonComponent, PlusSoIcon],
})
export class ButtonStoryComponent {
    private readonly destroyRef = inject(DestroyRef);

    public readonly type = input.required({ transform: buttonTypeAttribute });

    public readonly size = input.required({ transform: buttonSizeAttribute });

    public readonly shape = input.required({ transform: buttonShapeAttribute });

    public readonly toggle = input(false, { transform: booleanAttribute });

    public readonly selected = input(false, { transform: booleanAttribute });

    public readonly withIcon = input(false, { transform: booleanAttribute });

    public readonly selectedChange = output<boolean>();

    protected readonly isSelected = signal(false);

    constructor() {
        toObservable(this.selected)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (selected) => this.isSelected.set(selected),
            });
    }

    public readonly label = input('My Button label');

    protected onSelectedChange(selected: boolean) {
        this.isSelected.set(selected);
        this.selectedChange.emit(selected);
    }
}
