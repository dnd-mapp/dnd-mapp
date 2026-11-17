import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { DataTableComponent } from './data-table.component';
import { DataTableHarness, type DataTableLook, readColorToken, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

/** The width of `--size-measure`, which caps the width of the data table, in pixels. */
const MEASURE = 720;

/** How each kind of cell draws, as Penpot draws it, in the colors of the theme the test runs in. */
function readLooks(): Record<'columnHeader' | 'rowHeader' | 'cell', DataTableLook> {
    const muted = readColorToken('--color-foreground-muted');
    const none = 'rgba(0, 0, 0, 0)';

    return {
        columnHeader: {
            background: readColorToken('--color-background-sunken'),
            color: muted,
            fontWeight: '600',
            textTransform: 'uppercase',
        },
        rowHeader: {
            background: none,
            color: readColorToken('--color-foreground-default'),
            fontWeight: '600',
            textTransform: 'none',
        },
        cell: { background: none, color: muted, fontWeight: '400', textTransform: 'none' },
    };
}

describe('DataTableComponent', () => {
    @Component({
        template: `
            <div [style.width.px]="width()">
                <table dma-data-table>
                    <caption>
                        Data we process
                    </caption>
                    <thead>
                        <tr>
                            <th scope="col">Data</th>
                            <th scope="col">Why</th>
                            <th scope="col">Kept for</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">Server logs</th>
                            <td>To deliver pages, find errors, and stop abuse</td>
                            <td>14 days</td>
                        </tr>
                        <tr>
                            <th scope="row">Theme choice</th>
                            <td>So the next visit opens in the theme you picked</td>
                            <td>Until you clear your site data</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `,
        imports: [DataTableComponent],
    })
    class TestComponent {
        public readonly width = signal(600);
    }

    async function setupTest(options: { width?: number } = {}) {
        const { fixture, harness } = await setupTestEnvironment({ host: TestComponent, harness: DataTableHarness });

        if (options.width) {
            fixture.componentInstance.width.set(options.width);
        }
        TestBed.tick();

        return { harness };
    }

    it('should project the caption, the header row, and each row', async () => {
        const { harness } = await setupTest();

        expect(await harness.getCaption()).toBe('Data we process');
        expect(await harness.getCells()).toEqual([
            ['Data', 'Why', 'Kept for'],
            ['Server logs', 'To deliver pages, find errors, and stop abuse', '14 days'],
            ['Theme choice', 'So the next visit opens in the theme you picked', 'Until you clear your site data'],
        ]);
    });

    it('should leave the table to assistive technology, named by its caption', async () => {
        await setupTest();
        const table = page.getByRole('table', { name: 'Data we process' });

        await expect.element(table).toBeInTheDocument();
        expect(table.getByRole('columnheader').all()).toHaveLength(3);
        await expect.element(table.getByRole('columnheader').nth(1)).toHaveTextContent('Why');
        expect(table.getByRole('rowheader').all()).toHaveLength(2);
        await expect.element(table.getByRole('rowheader').nth(1)).toHaveTextContent('Theme choice');
        expect(table.getByRole('cell').all()).toHaveLength(4);
    });

    it('should hide the caption from sight', async () => {
        const { harness } = await setupTest();
        const { width, height } = await harness.getCaptionSize();

        expect(width).toBeLessThanOrEqual(1);
        expect(height).toBeLessThanOrEqual(1);
    });

    it('should draw the header row, the first cell of each row, and the other cells with their own looks', async () => {
        const { harness } = await setupTest();
        const looks = readLooks();

        for (const column of [0, 1, 2]) {
            expect(await harness.getLook(0, column)).toEqual(looks.columnHeader);
        }
        for (const row of [1, 2]) {
            expect(await harness.getLook(row, 0)).toEqual(looks.rowHeader);
            expect(await harness.getLook(row, 1)).toEqual(looks.cell);
            expect(await harness.getLook(row, 2)).toEqual(looks.cell);
        }
    });

    it('should pad each row 12 px on the block axis and 16 px on the inline axis, with cells 16 px apart', async () => {
        const { harness } = await setupTest();

        for (const row of [0, 1, 2]) {
            expect(await harness.getInsets(row, 0)).toEqual({ top: 12, right: 0, bottom: 12, left: 16 });
            expect(await harness.getInsets(row, 1)).toEqual({ top: 12, right: 0, bottom: 12, left: 16 });
            expect(await harness.getInsets(row, 2)).toEqual({ top: 12, right: 16, bottom: 12, left: 16 });
        }
    });

    it('should draw a divider above each row, below the header row', async () => {
        const { harness } = await setupTest();
        const divider = { color: readColorToken('--color-border-divider'), width: '1px' };

        expect((await harness.getDivider(0)).width).toBe('0px');
        expect(await harness.getDivider(1)).toEqual(divider);
        expect(await harness.getDivider(2)).toEqual(divider);
    });

    it('should draw a rounded border, with the header row rounded inside it', async () => {
        const { harness } = await setupTest();

        expect(await harness.getBorder()).toEqual({
            color: readColorToken('--color-border-divider'),
            width: '1px',
            radius: '10px',
        });
        expect(await harness.getHeaderCorners()).toEqual({ start: '9px', end: '9px' });
    });

    it('should fill a narrow container', async () => {
        const { harness } = await setupTest({ width: 360 });

        expect(await harness.getWidth()).toBe(360);
    });

    it('should grow no wider than the measure', async () => {
        const { harness } = await setupTest({ width: 1000 });

        expect(await harness.getWidth()).toBe(MEASURE);
    });
});
