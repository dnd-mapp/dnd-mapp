import { Overlay } from '@angular/cdk/overlay';
import { inject, Injectable } from '@angular/core';
import { OverlayConstructionOptions } from './models';

@Injectable({ providedIn: 'root' })
export class OverlayService {
    private readonly overlay = inject(Overlay);

    public show(options: OverlayConstructionOptions) {
        const overlayRef = this.overlay.create({
            disposeOnNavigation: true,
            ...(options.height ? { height: options.height } : {}),
            ...(options.scrollingStrategy ? { scrollStrategy: options.scrollingStrategy } : {}),
            ...(options.positionStrategy ? { positionStrategy: options.positionStrategy } : {}),
            ...(options.hasBackdrop ? { hasBackdrop: true } : {}),
            ...(options.backdropClass ? { backdropClass: options.backdropClass } : {}),
        });

        return {
            overlayRef: overlayRef,
        };
    }
}
