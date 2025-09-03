import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-root',
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class RootComponent {}
