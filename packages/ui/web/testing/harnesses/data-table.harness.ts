import { ComponentHarness, type TestElement } from '@angular/cdk/testing';

/** The padding of a cell, in pixels. */
export interface DataTableInsets {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

/**
 * Reads a data table. A cell is addressed by its row and column, both from 0, where row 0 is the header row and the
 * rows of the body follow it.
 */
export class DataTableHarness extends ComponentHarness {
    public static readonly hostSelector = 'table[dma-data-table]';

    private readonly caption = this.locatorFor(':scope > caption');
    private readonly rows = this.locatorForAll(':scope > :is(thead, tbody) > tr');

    /** The text of the caption. */
    public async getCaption(): Promise<string> {
        return (await this.caption()).text();
    }

    /** The text of each cell, row by row, the header row first. */
    public async getCells(): Promise<string[][]> {
        const rows = await this.rows();

        return Promise.all(
            rows.map(async (_, row) => {
                const cells = await this.locatorForAll(`${this.rowSelector(row)} > :is(th, td)`)();

                return Promise.all(cells.map(async (cell) => cell.text()));
            }),
        );
    }

    /** The padding of the cell at `row` and `column`. */
    public async getInsets(row: number, column: number): Promise<DataTableInsets> {
        const cell = await this.getCell(row, column);
        const [top, right, bottom, left] = await Promise.all([
            cell.getCssValue('padding-top'),
            cell.getCssValue('padding-right'),
            cell.getCssValue('padding-bottom'),
            cell.getCssValue('padding-left'),
        ]);

        return { top: parseFloat(top), right: parseFloat(right), bottom: parseFloat(bottom), left: parseFloat(left) };
    }

    /** The size of the caption, in pixels. */
    public async getCaptionSize(): Promise<{ width: number; height: number }> {
        const { width, height } = await (await this.caption()).getDimensions();

        return { width, height };
    }

    /** The width of the data table, in pixels. */
    public async getWidth(): Promise<number> {
        return (await (await this.host()).getDimensions()).width;
    }

    private rowSelector(row: number): string {
        return row === 0 ? ':scope > thead > tr:first-child' : `:scope > tbody > tr:nth-child(${String(row)})`;
    }

    private async getCell(row: number, column: number): Promise<TestElement> {
        const cell = await this.locatorForOptional(
            `${this.rowSelector(row)} > :is(th, td):nth-child(${String(column + 1)})`,
        )();

        if (!cell) {
            throw new Error(`The data table holds no cell at row ${String(row)}, column ${String(column)}.`);
        }
        return cell;
    }
}
