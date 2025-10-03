import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
    AfterContentInit,
    ChangeDetectionStrategy,
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
import { OverlayService } from '../overlay';
import { OptionComponent } from './option.component';
import { selectPositions } from './select-positions';

@Component({
    selector: 'dma-select',
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class SelectComponent implements AfterContentInit {
    private readonly overlay = inject(Overlay);
    private readonly viewContainerRef = inject(ViewContainerRef);
    private readonly overlayService = inject(OverlayService);

    protected readonly label = computed(() => this.selectedOption()?.label() ?? 'select');

    private readonly options = contentChildren(OptionComponent);

    private readonly selectedOption = signal<OptionComponent>(null);

    private readonly isOpen = computed(() => this.overlayRef() !== null);

    private readonly overlayAnchor = viewChild.required<ElementRef>('anchor');

    private readonly overlayTemplateRef = viewChild.required<TemplateRef<HTMLElement>>('overlay');

    private overlayRef = signal<OverlayRef>(null);

    public ngAfterContentInit() {
        this.selectedOption.set(this.options()[0]);
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
            .withPositions(selectPositions);

        const scrollStrategy = this.overlay.scrollStrategies.reposition({ autoClose: true, scrollThrottle: 100 });

        const { overlayRef } = this.overlayService.show({
            positionStrategy: positionStrategy,
            scrollingStrategy: scrollStrategy,
            hasBackdrop: false,
        });

        this.overlayRef.set(overlayRef);

        this.overlayRef().attach(new TemplatePortal(this.overlayTemplateRef(), this.viewContainerRef));
    }

    private hide() {
        this.overlayRef().dispose();
        this.overlayRef.set(null);
    }
}
