import { PositionStrategy, ScrollStrategy } from '@angular/cdk/overlay';

export interface OverlayConstructionOptions {
    hasBackdrop?: boolean;
    backdropClass?: string[];
    height?: string;
    minWidth?: number | string;
    scrollingStrategy?: ScrollStrategy;
    positionStrategy?: PositionStrategy;
}
