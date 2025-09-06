import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-lock-so-icon, dma-icon[dma-lock-so-icon]',
    templateUrl: './lock.icon.svg',
    styleUrl: '../../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LockIcon {}
