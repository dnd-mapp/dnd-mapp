import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-envelope-icon, dma-icon[dma-envelope-icon]',
    templateUrl: './envelope.icon.svg',
    styleUrl: '../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvelopeIcon {}
