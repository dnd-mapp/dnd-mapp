import { Component } from '@angular/core';
import { createTestEnvironment, TableHarness } from '@dnd-mapp/shared-ui/test';
import { TableBodyComponent } from './body';
import { TableColumnComponent } from './column';
import { TableHeaderComponent } from './header';
import { TableRowComponent } from './row';
import { TableComponent } from './table.component';

describe('TableComponent', () => {
    @Component({
        template: `
            <dma-table>
                <dma-table-header>
                    <dma-table-row>
                        <dma-table-column>Column 1</dma-table-column>
                        <dma-table-column>Column 2</dma-table-column>
                        <dma-table-column>Column 3</dma-table-column>
                        <dma-table-column>Column 4</dma-table-column>
                    </dma-table-row>
                </dma-table-header>
                <dma-table-body>
                    <dma-table-row>
                        <dma-table-column>Row 1 - Column 1</dma-table-column>
                        <dma-table-column>Row 1 - Column 2</dma-table-column>
                        <dma-table-column>Row 1 - Column 3</dma-table-column>
                        <dma-table-column>Row 1 - Column 4</dma-table-column>
                    </dma-table-row>
                </dma-table-body>
            </dma-table>
        `,
        imports: [TableComponent, TableHeaderComponent, TableRowComponent, TableColumnComponent, TableBodyComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: TableHarness,
        });

        return {
            harness: harness,
        };
    }

    it('should distribute the total width for the available table columns', async () => {
        const { harness } = await setupTest();

        const tableRowHarness = await harness.getRowByIndex(0);
        const columnHarnesses = await tableRowHarness.getColumns();

        for (const columnHarness of columnHarnesses) {
            expect(await columnHarness.width()).toEqual('25%');
        }
    });
});
