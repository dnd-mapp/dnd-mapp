import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-xmark-icon, dma-icon[dma-xmark-icon]',
    templateUrl: './xmark.icon.svg',
    styleUrl: '../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XmarkIcon {}
