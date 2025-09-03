import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-plus-icon, dma-icon[dma-plus-icon]',
    templateUrl: './plus.icon.svg',
    styleUrl: '../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlusIcon {}
