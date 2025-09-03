import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
    TableBodyComponent,
    TableColumnComponent,
    TableComponent,
    TableHeaderComponent,
    TableRowComponent,
} from '@dnd-mapp/shared-ui';

@Component({
    selector: 'dma-story',
    templateUrl: './table-story.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableColumnComponent],
})
export class TableStoryComponent {
    protected readonly data = [
        { id: 1, username: 'Bob', email: 'bob@company.com' },
        { id: 2, username: 'Alice', email: 'alice@company.com' },
        { id: 3, username: 'Jeffrey', email: 'jeffrey@company.com' },
    ];
}
