import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-spinner-icon, dma-icon[dma-spinner-icon]',
    templateUrl: './spinner.icon.svg',
    styleUrls: ['../icons.scss', './spinner.icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerIcon {}
