import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-icon[dma-compass-so-icon]',
    templateUrl: './compass-so-icon.component.svg',
    styleUrls: ['../../icons.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompassSoIconComponent {}
