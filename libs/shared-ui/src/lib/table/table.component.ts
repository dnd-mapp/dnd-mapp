import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-table',
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {}
