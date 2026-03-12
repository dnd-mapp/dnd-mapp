import { TOOLTIP_TIMINGS } from '@/common';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Directive, effect, ElementRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, map, of, switchMap, take, tap, timer } from 'rxjs';
import {
    HORIZONTAL_POSITIONS,
    orientationAttribute,
    Orientations,
    positionAttribute,
    Positions,
    VERTICAL_POSITIONS,
} from '../overlay/positions';
import { TooltipState, TooltipStates } from './tooltip-state';
import { TooltipComponent } from './tooltip.component';

@Directive({
    selector: '[dmaTooltipAnchor]',
    exportAs: 'dmaTooltip',
    host: {
        '[attr.dmaTooltipAnchor]': 'label()',
        '(mouseenter)': 'onShow()',
        '(mouseleave)': 'onHide()',
    },
})
export class TooltipAnchorDirective {
    private readonly overlay = inject(Overlay);
    private readonly elementRef = inject(ElementRef);
    private readonly delays = inject(TOOLTIP_TIMINGS);

    public readonly label = input<string | undefined>(undefined, { alias: 'dmaTooltipAnchor' });

    public readonly tooltipDisabled = input<boolean>(false);

    public readonly position = input(undefined, { transform: positionAttribute });

    public readonly orientation = input(Orientations.VERTICAL, { transform: orientationAttribute });

    private readonly state = signal<TooltipState>(TooltipStates.HIDDEN);

    private overlayRef: OverlayRef | undefined;
    private componentRef: ComponentRef<TooltipComponent> | undefined;

    constructor() {
        effect(() => {
            const label = this.label();

            if (this.componentRef && label) {
                this.componentRef.setInput('label', label);
            }
        });

        toObservable(this.state)
            .pipe(
                filter((currentState) =>
                    [TooltipStates.HIDING, TooltipStates.SHOWING].some((state) => state === currentState)
                ),
                switchMap((state) =>
                    timer(state === TooltipStates.SHOWING ? this.delays.showDelay : this.delays.hideDelay).pipe(
                        take(1),
                        map(() => state)
                    )
                ),
                switchMap((state) => {
                    if (state === TooltipStates.SHOWING) {
                        this.show();
                        return of(false);
                    }
                    this.hide();

                    return timer(this.delays.hideAnimationDelay).pipe(
                        take(1),
                        tap(() => this.dispose()),
                        map(() => true)
                    );
                }),
                takeUntilDestroyed()
            )
            .subscribe();
    }

    public reposition() {
        if (!this.overlayRef) return;
        this.overlayRef.updatePosition();
    }

    public onShow() {
        if (this.tooltipDisabled() || !this.label()) return;
        this.state.set(TooltipStates.SHOWING);
    }

    public onHide() {
        if ([TooltipStates.SHOWN, TooltipStates.SHOWING].every((state) => state !== this.state())) return;
        this.state.set(TooltipStates.HIDING);
    }

    private show() {
        const scrollingStrategy = this.overlay.scrollStrategies.reposition({
            autoClose: true,
            scrollThrottle: 100,
        });

        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(this.elementRef)
            .withPositions(this.getPositions())
            .withGrowAfterOpen(true);

        this.overlayRef = this.overlay.create({
            scrollStrategy: scrollingStrategy,
            positionStrategy: positionStrategy,
            disposeOnNavigation: true,
        });

        const componentPortal = new ComponentPortal(TooltipComponent);

        this.componentRef = this.overlayRef.attach(componentPortal);
        this.componentRef.setInput('label', this.label());
        this.state.set(TooltipStates.SHOWN);
    }

    private hide() {
        if (!this.componentRef || !this.overlayRef) return;
        this.componentRef.destroy();
    }

    private dispose() {
        if (!this.componentRef || !this.overlayRef) return;
        this.overlayRef.dispose();

        this.overlayRef = undefined;
        this.componentRef = undefined;
        this.state.set(TooltipStates.HIDDEN);
    }

    private getPositions() {
        const position = this.position();
        const orientation = this.orientation();

        if (position === Positions.BEFORE || orientation === Orientations.HORIZONTAL) {
            return [...HORIZONTAL_POSITIONS];
        } else if (position === Positions.AFTER || orientation === Orientations.HORIZONTAL_REVERSE) {
            return [...HORIZONTAL_POSITIONS].reverse();
        } else if (position === Positions.BELOW || orientation === Orientations.VERTICAL_REVERSE) {
            return [...VERTICAL_POSITIONS].reverse();
        } else {
            return [...VERTICAL_POSITIONS];
        }
    }
}
