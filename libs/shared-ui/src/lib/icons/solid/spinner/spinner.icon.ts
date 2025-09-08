import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-spinner-so-icon, dma-icon[dma-spinner-so-icon]',
    templateUrl: './spinner.icon.svg',
    styleUrls: ['../../icons.scss', './spinner.icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerSoIcon {}
