import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-house-icon, dma-icon[dma-house-icon]',
    templateUrl: './house.icon.svg',
    styleUrl: '../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HouseIcon {}
