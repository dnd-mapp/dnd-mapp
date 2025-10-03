import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    contentChildren,
    ElementRef,
    inject,
    signal,
    TemplateRef,
    viewChild,
    ViewContainerRef,
} from '@angular/core';
import { outputToObservable, toObservable } from '@angular/core/rxjs-interop';
import { filter, map, merge, switchMap } from 'rxjs';
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
    },
    exportAs: 'dmaSelect',
    imports: [ChevronDownSoIconComponent, ChevronUpSoIconComponent],
})
export class SelectComponent implements AfterContentInit {
    private readonly overlay = inject(Overlay);
    private readonly viewContainerRef = inject(ViewContainerRef);
    private readonly overlayService = inject(OverlayService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    public readonly value = computed(() => this.selectedOption()?.value());

    protected readonly label = computed(() => this.selectedOption()?.label() ?? 'select');

    protected readonly isOpen = computed(() => this.overlayRef() !== null);

    private readonly options = contentChildren(OptionComponent);

    private readonly selectedOption = signal<OptionComponent>(null);

    private readonly hasOptionSelected = computed(() => Boolean(this.selectedOption()));

    private readonly overlayAnchor = viewChild.required<ElementRef<HTMLElement>>('anchor');

    private readonly overlayTemplateRef = viewChild.required<TemplateRef<HTMLElement>>('overlay');

    private overlayRef = signal<OverlayRef>(null);

    constructor() {
        toObservable(this.options)
            .pipe(
                switchMap((options) =>
                    merge(
                        ...options.map((option) => outputToObservable(option.selectedChange).pipe(map(() => option))),
                    ),
                ),
                filter((option) => option.isSelected()),
            )
            .subscribe({
                next: (option) => {
                    this.hide();

                    if (option === this.selectedOption()) return;

                    if (this.hasOptionSelected()) this.selectedOption().isSelected.set(false);
                    this.selectedOption.set(option);
                    this.changeDetectorRef.markForCheck();
                    console.log(this.selectedOption().label());
                },
            });
    }

    public ngAfterContentInit() {
        this.options()[0].isSelected.set(true);

        console.log(this.options()[0].label());
    }

    protected onToggle() {
        if (this.isOpen()) this.hide();
        else this.open();
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
    }

    private hide() {
        if (!this.isOpen()) return;
        this.overlayRef().dispose();
        this.overlayRef.set(null);
    }
}
