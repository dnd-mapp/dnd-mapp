import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-circle-so-icon, dma-icon[dma-circle-so-icon]',
    templateUrl: './circle.icon.svg',
    styleUrl: '../../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleIcon {}
