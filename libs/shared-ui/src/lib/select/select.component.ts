import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChildren,
    DestroyRef,
    ElementRef,
    inject,
    output,
    signal,
    TemplateRef,
    viewChild,
    ViewContainerRef,
} from '@angular/core';
import { outputToObservable, takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { map, merge, switchMap } from 'rxjs';
import { ChevronDownSoIconComponent, ChevronUpSoIconComponent } from '../icons';
import { OverlayService } from '../overlay';
import { OptionComponent } from './option.component';
import { selectPositions } from './select-positions';

@Component({
    selector: 'dma-select',
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.open]': 'isOpen()',
        '(window:click)': 'onGlobalClick(isOpen())',
    },
    exportAs: 'dmaSelect',
    imports: [ChevronDownSoIconComponent, ChevronUpSoIconComponent],
})
export class SelectComponent implements AfterContentInit {
    private readonly viewContainerRef = inject(ViewContainerRef);
    private readonly destroyRef = inject(DestroyRef);
    private readonly overlay = inject(Overlay);
    private readonly overlayService = inject(OverlayService);

    public readonly valueChange = output<unknown>();

    protected readonly label = computed(() => this.selectedOption()?.label() ?? 'select');

    protected readonly isOpen = computed(() => this.overlayRef() !== null);

    private readonly value = computed(() => this.selectedOption()?.value());

    private readonly options = contentChildren(OptionComponent);

    private readonly selectedOption = signal<OptionComponent>(null);

    private readonly hasOptionSelected = computed(() => Boolean(this.selectedOption()));

    private readonly overlayAnchor = viewChild.required<ElementRef<HTMLElement>>('anchor');

    private readonly overlayTemplateRef = viewChild.required<TemplateRef<HTMLElement>>('overlay');

    private overlayRef = signal<OverlayRef>(null);

    private globalClicks = 0;

    constructor() {
        toObservable(this.options)
            .pipe(
                switchMap((options) =>
                    merge(
                        ...options.map((option) => outputToObservable(option.selectedChange).pipe(map(() => option))),
                    ),
                ),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((option) => {
                this.close();
                this.selectOption(option, true);
            });
    }

    public ngAfterContentInit() {
        const preSelectedOption = this.options().find((option) => option.isSelected());
        this.selectOption(preSelectedOption ?? this.options()[0]);
    }

    protected onToggle() {
        if (this.isOpen()) this.close();
        else this.open();
    }

    protected onGlobalClick(isOpen: boolean) {
        if (!isOpen || ++this.globalClicks <= 1) return;
        this.close();
    }

    private open() {
        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(this.overlayAnchor())
            .withViewportMargin(16)
            .withGrowAfterOpen(true)
            .withLockedPosition(false)
            .withPositions(selectPositions);
        const scrollStrategy = this.overlay.scrollStrategies.reposition({ autoClose: true, scrollThrottle: 100 });
        const width = getComputedStyle(this.overlayAnchor().nativeElement).width;

        const { overlayRef } = this.overlayService.show({
            positionStrategy: positionStrategy,
            scrollingStrategy: scrollStrategy,
            hasBackdrop: false,
            minWidth: width,
        });

        this.overlayRef.set(overlayRef);

        this.overlayRef().attach(new TemplatePortal(this.overlayTemplateRef(), this.viewContainerRef));
        this.globalClicks = 0;
    }

    private close() {
        if (!this.isOpen()) return;
        this.overlayRef().dispose();
        this.overlayRef.set(null);
    }

    private selectOption(option: OptionComponent, emit = false) {
        if (this.hasOptionSelected()) this.selectedOption().isSelected.set(false);
        if (!option.isSelected()) option.isSelected.set(true);
        this.selectedOption.set(option);

        if (!emit) return;
        this.valueChange.emit(this.value());
    }
}
