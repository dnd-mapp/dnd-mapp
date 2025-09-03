import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-user-group-icon, dma-icon[dma-user-group-icon]',
    templateUrl: './user-group.icon.svg',
    styleUrl: '../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserGroupIcon {}
