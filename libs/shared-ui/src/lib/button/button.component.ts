import {
    AfterContentInit,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    HostBinding,
    input,
    signal,
    viewChild,
} from '@angular/core';
import { SpinnerIcon } from '../icons';
import { buttonTypeAttribute, ButtonTypes } from './models';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'button[dma-button]',
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SpinnerIcon],
})
export class ButtonComponent implements AfterContentInit {
    public readonly dmaButton = input(ButtonTypes.SECONDARY, {
        alias: 'dma-button',
        transform: buttonTypeAttribute,
    });

    public readonly processing = input(false, { transform: booleanAttribute });

    public readonly disabled = input(false, { transform: booleanAttribute });

    protected readonly contentWidth = signal<number>(null);

    private readonly _disabled = computed(() => (this.disabled() || this.processing() ? '' : undefined));

    private readonly contentElement = viewChild<ElementRef<HTMLDivElement>>('content');

    @HostBinding('attr.disabled')
    protected get isDisabled() {
        return this._disabled();
    }

    @HostBinding('attr.dma-button')
    protected get buttonType() {
        return this.dmaButton();
    }

    public ngAfterContentInit() {
        const elementWidth = getComputedStyle(this.contentElement().nativeElement).width;
        const widthInPixels = Number(elementWidth.replace('px', ''));

        // TODO: replace hardcoded font-size with theme variable
        const widthInEm = widthInPixels / 16;

        this.contentWidth.set(widthInEm);
    }
}
