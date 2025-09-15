import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    contentChildren,
    DestroyRef,
    inject,
    Injector,
    input,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
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
export class ButtonGroupComponent implements AfterContentInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly injector = inject(Injector);

    // eslint-disable-next-line @angular-eslint/no-input-rename
    public readonly size = input(DEFAULT_BUTTON_SIZE, { transform: buttonSizeAttribute, alias: 'dmaButtonSize' });

    private readonly buttons = contentChildren(ButtonComponent);

    public ngAfterContentInit() {
        toObservable(this.buttons, { injector: this.injector })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (buttons) => this.setButtonSize([...buttons]),
            });
    }

    private setButtonSize(buttons: ButtonComponent[]) {
        buttons.forEach((button) => button.buttonSize.set(this.size()));
    }
}
