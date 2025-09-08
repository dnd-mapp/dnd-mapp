import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-check-so-icon, dma-icon[dma-check-so-icon]',
    templateUrl: './check.icon.svg',
    styleUrl: '../../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckSoIcon {}
