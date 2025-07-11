import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
    ComponentRef,
    DestroyRef,
    Directive,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    computed,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ShowHideAnimationState, ShowHideAnimationStates } from './animations';
import {
    TooltipOrientation,
    TooltipPosition,
    buildTooltipPositions,
    isVerticalPosition,
    tooltipOrientationAttribute,
    tooltipPositionAttribute,
} from './models';
import { TooltipComponent } from './tooltip.component';

@Directive({
    selector: '[dmaTooltip]',
})
export class TooltipDirective implements OnDestroy {
    private readonly overlay = inject(Overlay);
    private readonly elementRef = inject(ElementRef<HTMLElement>);
    protected readonly destroyRef = inject(DestroyRef);

    @Input({ alias: 'dmaTooltip', required: true }) @HostBinding('attr.dmaTooltip') public label: string;

    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input({ alias: 'tooltipOrientation', transform: tooltipOrientationAttribute }) public set orientation(
        orientation: TooltipOrientation
    ) {
        this.orientationSignal.set(orientation);
        this.updatePosition();
    }
    private readonly orientationSignal = signal<TooltipOrientation>(null);

    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input({ alias: 'tooltipPosition', transform: tooltipPositionAttribute }) public set position(
        position: TooltipPosition
    ) {
        this.positionSignal.set(position);

        if (!this.orientationSignal()) {
            this.orientationSignal.set(isVerticalPosition(position) ? 'vertical' : 'horizontal');
        }
        this.updatePosition();
    }
    private readonly positionSignal = signal<TooltipPosition>(null);

    private overlayRef: OverlayRef;
    private componentRef: ComponentRef<TooltipComponent>;

    public isShowing = computed(() => this.componentRef?.instance.currentState() === ShowHideAnimationStates.SHOWN);

    public ngOnDestroy() {
        this.removeTooltip();
    }

    public close() {
        this.toggleTooltip(ShowHideAnimationStates.HIDDEN);
    }

    @HostListener('mouseenter')
    protected onMouseenter() {
        if (this.isHostDisabled) return;
        if (!this.componentRef) this.initializeTooltip();
        this.toggleTooltip(ShowHideAnimationStates.SHOWN);
    }

    @HostListener('mouseleave')
    protected onMouseleave() {
        this.toggleTooltip(ShowHideAnimationStates.HIDDEN);
    }

    private get isHostDisabled() {
        return this.elementRef.nativeElement.getAttribute('disabled') === '';
    }

    private toggleTooltip(state: ShowHideAnimationState) {
        if (!this.componentRef) return;
        this.componentRef.instance.updateAnimationState(state);
    }

    private initializeTooltip() {
        const positionStrategy = this.withPositionStrategy();

        this.overlayRef = this.overlay.create({
            positionStrategy: positionStrategy,
            scrollStrategy: this.withScrollStrategy(),
            hasBackdrop: false,
            disposeOnNavigation: true,
        });

        this.componentRef = this.overlayRef.attach(new ComponentPortal(TooltipComponent));
        this.componentRef.instance.label = this.label;

        this.componentRef.instance.animationDone
            .asObservable()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => this.removeTooltip(),
            });
    }

    private withPositionStrategy() {
        return this.overlay
            .position()
            .flexibleConnectedTo(this.elementRef)
            .withViewportMargin(16)
            .withPositions(buildTooltipPositions(this.orientationSignal(), this.positionSignal()));
    }

    private withScrollStrategy() {
        return this.overlay.scrollStrategies.reposition({ scrollThrottle: 100, autoClose: true });
    }

    private updatePosition() {
        if (!this.overlayRef) return;

        this.overlayRef.updatePositionStrategy(this.withPositionStrategy());
        this.overlayRef.updatePosition();
    }

    private removeTooltip() {
        if (!this.componentRef) return;
        this.componentRef.destroy();
        this.componentRef = null;

        this.overlayRef.detach();
        this.overlayRef.dispose();

        this.overlayRef = null;
    }
}
