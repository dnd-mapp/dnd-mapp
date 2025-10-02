import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-icon[dma-users-so-icon]',
    templateUrl: './users-so-icon.component.svg',
    styleUrls: ['../../icons.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersSoIconComponent {}
