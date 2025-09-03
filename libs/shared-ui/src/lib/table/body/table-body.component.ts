import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-table-body',
    templateUrl: './table-body.component.html',
    styleUrl: './table-body.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableBodyComponent {}
