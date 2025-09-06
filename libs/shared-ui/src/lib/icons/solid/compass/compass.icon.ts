import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-compass-so-icon, dma-icon[dma-compass-so-icon]',
    templateUrl: './compass.icon.svg',
    styleUrl: '../../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompassIcon {}
