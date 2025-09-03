import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-table-header',
    templateUrl: './table-header.component.html',
    styleUrl: './table-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHeaderComponent {}
