import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-app-bar',
    templateUrl: './app-bar.component.html',
    styleUrl: './app-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class AppBarComponent {}
