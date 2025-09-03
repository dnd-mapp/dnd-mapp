import { ComponentHarness } from '@angular/cdk/testing';
import { TableBodyHarness } from './table-body.harness';

export class TableHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-table';

    private readonly bodyLocator = this.locatorFor(TableBodyHarness);

    public async isTableEmptyMessageVisible() {
        return await (await this.bodyLocator()).isTableEmptyMessageVisible();
    }

    public async getTableEmptyMessage() {
        return await (await this.bodyLocator()).getEmptyRowText();
    }

    public async getNumberOfRows() {
        return await (await this.bodyLocator()).getNumberOfRows();
    }

    public async getRowByIndex(index: number) {
        return await (await this.bodyLocator()).getRowByIndex(index);
    }
}
