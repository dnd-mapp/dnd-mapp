import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-user-so-icon, dma-icon[dma-user-so-icon]',
    templateUrl: './user.icon.svg',
    styleUrl: '../../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSoIcon {}
