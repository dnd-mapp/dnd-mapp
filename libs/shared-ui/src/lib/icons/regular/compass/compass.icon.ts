import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-compass-re-icon, dma-icon[dma-compass-re-icon]',
    templateUrl: './compass.icon.svg',
    styleUrl: '../../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompassIcon {}
