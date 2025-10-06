import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-ordered-list',
    templateUrl: './ordered-list.component.html',
    styleUrl: './ordered-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class OrderedListComponent {}
