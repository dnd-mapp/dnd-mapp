import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-envelope-so-icon, dma-icon[dma-envelope-so-icon]',
    templateUrl: './envelope.icon.svg',
    styleUrl: '../../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvelopeIcon {}
