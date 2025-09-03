import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-circle-icon, dma-icon[dma-circle-icon]',
    templateUrl: './circle.icon.svg',
    styleUrl: '../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleIcon {}
