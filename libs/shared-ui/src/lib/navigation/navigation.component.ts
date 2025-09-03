import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-navigation',
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {}
