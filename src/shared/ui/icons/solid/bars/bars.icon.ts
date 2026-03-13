import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-icon[dma-bars-icon]',
    templateUrl: './bars.icon.svg',
    styleUrl: '../../icon.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarsIcon {}
