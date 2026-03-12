import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-icon[dma-angle-left-icon]',
    templateUrl: './angle-left.icon.svg',
    styleUrl: '../../icon.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngleLeftIcon {}
