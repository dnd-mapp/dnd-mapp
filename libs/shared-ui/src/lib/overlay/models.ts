import { ConnectedPosition, OverlayConfig } from '@angular/cdk/overlay';

export interface CreateOverlayOptions {
    overlayConfig: Exclude<OverlayConfig, 'positionStrategy'>;
    positions?: ConnectedPosition[];
    pushOnScreen?: boolean;
    lockedPosition?: boolean;
    viewportMargin?: number;
    flexibleDimensions?: boolean;
    growAfterOpen?: boolean;
    offsetX?: number;
    offsetY?: number;
}
