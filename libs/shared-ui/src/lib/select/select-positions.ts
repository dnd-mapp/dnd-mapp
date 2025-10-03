import { ConnectedPosition } from '@angular/cdk/overlay';

export const selectPositions: ConnectedPosition[] = [
    {
        overlayX: 'start',
        overlayY: 'top',
        originX: 'start',
        originY: 'bottom',
        offsetY: 4,
    },
    {
        overlayX: 'start',
        overlayY: 'bottom',
        originX: 'start',
        originY: 'top',
        offsetY: 4,
    },
];
