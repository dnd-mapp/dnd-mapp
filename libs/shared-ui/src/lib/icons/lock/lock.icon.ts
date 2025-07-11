import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-lock-icon, dma-icon[dma-lock-icon]',
    templateUrl: './lock.icon.svg',
    styleUrl: '../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LockIcon {}
