import { AfterViewInit, ChangeDetectionStrategy, Component, ContentChildren, QueryList } from '@angular/core';
import { TableColumnComponent } from '../column';

@Component({
    selector: 'dma-table-row',
    templateUrl: './table-row.component.html',
    styleUrl: './table-row.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableRowComponent implements AfterViewInit {
    @ContentChildren(TableColumnComponent) private readonly columns: QueryList<TableColumnComponent>;

    public ngAfterViewInit() {
        const [remainingWidth, columnsWithDefinedWidth] = this.columns.reduce(
            ([remainingWidth, columnsWithDefinedWidth], column) => {
                if (column.width === 100) return [remainingWidth, columnsWithDefinedWidth];
                return [remainingWidth - column.width, columnsWithDefinedWidth + 1];
            },
            [100, 0]
        );

        this.columns.forEach((column) => {
            if (column.width !== 100) return;
            column.width = remainingWidth / (this.columns.length - columnsWithDefinedWidth);
        });
    }
}
