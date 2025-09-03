import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-circle-exclamation-icon, dma-icon[dma-circle-exclamation-icon]',
    templateUrl: './circle-exclamation.icon.svg',
    styleUrl: '../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleExclamationIcon {}
