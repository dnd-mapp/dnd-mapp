import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-plus-so-icon, dma-icon[dma-plus-so-icon]',
    templateUrl: './plus.icon.svg',
    styleUrl: '../../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlusIcon {}
