import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-trash-icon, dma-icon[dma-trash-icon]',
    templateUrl: './trash.icon.svg',
    styleUrl: '../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrashIcon {}
