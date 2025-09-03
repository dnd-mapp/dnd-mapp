import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-check-icon, dma-icon[dma-check-icon]',
    templateUrl: './check.icon.svg',
    styleUrl: '../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckIcon {}
