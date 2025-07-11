import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-user-icon, dma-icon[dma-user-icon]',
    templateUrl: './user.icon.svg',
    styleUrl: '../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserIcon {}
