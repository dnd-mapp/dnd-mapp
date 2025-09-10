import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Directive, ElementRef, inject, Type } from '@angular/core';
import { CreateOverlayOptions } from './models';

@Directive({
    selector: '[dmaOverlayTarget]',
})
export class OverlayTargetDirective {
    private readonly overlay = inject(Overlay);
    private readonly elementRef = inject(ElementRef);

    protected createOverlay<T>(component: Type<T>, options: CreateOverlayOptions) {
        const positionStrategy = this.overlay.position().flexibleConnectedTo(this.elementRef);

        if (options.positions) {
            positionStrategy.withPositions(options.positions);
        }
        if (options.pushOnScreen) {
            positionStrategy.withPush(options.pushOnScreen);
        }
        if (options.lockedPosition) {
            positionStrategy.withLockedPosition(options.lockedPosition);
        }
        if (options.viewportMargin) {
            positionStrategy.withViewportMargin(options.viewportMargin);
        }
        if (options.flexibleDimensions) {
            positionStrategy.withFlexibleDimensions(options.flexibleDimensions);
        }
        if (options.growAfterOpen) {
            positionStrategy.withGrowAfterOpen(options.growAfterOpen);
        }
        if (options.offsetX) {
            positionStrategy.withDefaultOffsetX(options.offsetX);
        }
        if (options.offsetY) {
            positionStrategy.withDefaultOffsetY(options.offsetY);
        }
        const overlayRef = this.overlay.create({
            positionStrategy: positionStrategy,
            ...options.overlayConfig,
        });
        const componentRef = overlayRef.attach(new ComponentPortal(component));

        return {
            overlayRef: overlayRef,
            componentRef: componentRef,
            positionStrategy: positionStrategy,
        };
    }
}
