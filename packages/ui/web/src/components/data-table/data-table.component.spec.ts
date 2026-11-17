import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { DataTableComponent } from './data-table.component';
import {
    type DataTableBox,
    DataTableHarness,
    type DataTableLook,
    readColorToken,
    setupTestEnvironment,
} from '@dnd-mapp/ui-web/testing';

/** The width of `--size-measure`, which caps the width of the data table, in pixels. */
const MEASURE = 720;

/** The height of a line of `typography.caps` and of `typography.body-sm`, in pixels. */
const CAPS_LINE = 13 * 1.4;
const BODY_SM_LINE = 14 * 1.5;

function bottom(box: DataTableBox): number {
    return box.top + box.height;
}

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
                            <th scope="col">{{ keptFor() }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @for (row of rows(); track row[0]) {
                            <tr>
                                <th scope="row">{{ row[0] }}</th>
                                <td>{{ row[1] }}</td>
                                <td>{{ row[2] }}</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        `,
        imports: [DataTableComponent],
    })
    class TestComponent {
        public readonly width = signal(600);
        public readonly keptFor = signal('Kept for');
        public readonly rows = signal([
            ['Server logs', 'To deliver pages, find errors, and stop abuse', '14 days'],
            ['Theme choice', 'So the next visit opens in the theme you picked', 'Until you clear your site data'],
        ]);
    }

    // The tests run on a wide screen, and the ones on narrow screens set a viewport below the desktop breakpoint.
    const { innerWidth, innerHeight } = window;

    beforeEach(async () => {
        await page.viewport(1280, 800);
    });

    afterEach(async () => {
        await page.viewport(innerWidth, innerHeight);
    });

    async function setupTest(options: { width?: number } = {}) {
        const { fixture, harness } = await setupTestEnvironment({ host: TestComponent, harness: DataTableHarness });

        if (options.width) {
            fixture.componentInstance.width.set(options.width);
        }
        TestBed.tick();

        return { host: fixture.componentInstance, harness };
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

    describe('on narrow screens', () => {
        beforeEach(async () => {
            await page.viewport(375, 812);
        });

        it('should leave the table to assistive technology, named by its caption', async () => {
            await setupTest({ width: 360 });
            const table = page.getByRole('table', { name: 'Data we process' });

            await expect.element(table).toBeInTheDocument();
            expect(table.getByRole('columnheader').all()).toHaveLength(3);
            expect(table.getByRole('rowheader').all()).toHaveLength(2);
            expect(table.getByRole('cell').all()).toHaveLength(4);
        });

        it('should take no room for the header row', async () => {
            const { harness } = await setupTest({ width: 360 });

            expect((await harness.getRowBox(1)).top).toBe(0);
        });

        it('should draw each row as a card with a rounded border, 12 px apart', async () => {
            const { harness } = await setupTest({ width: 360 });
            const [first, second] = await Promise.all([harness.getRowBox(1), harness.getRowBox(2)]);

            expect(first).toEqual(expect.objectContaining({ left: 0, width: 360 }));
            expect(second.top - bottom(first)).toBeCloseTo(12);
            expect(await harness.getRowBorder(1)).toEqual({
                color: readColorToken('--color-border-divider'),
                width: '1px',
                radius: '10px',
            });
            expect((await harness.getBorder()).width).toBe('0px');
        });

        it('should inset the cells of each card 16 px, 12 px apart', async () => {
            const { harness } = await setupTest({ width: 360 });
            const [card, title, why, keptFor] = await Promise.all([
                harness.getRowBox(1),
                harness.getCellBox(1, 0),
                harness.getCellBox(1, 1),
                harness.getCellBox(1, 2),
            ]);

            for (const cell of [title, why, keptFor]) {
                expect(cell).toEqual(expect.objectContaining({ left: 16, width: 360 - 32 }));
            }
            expect(title.top - card.top).toBeCloseTo(16);
            expect(why.top - bottom(title)).toBeCloseTo(12);
            expect(keptFor.top - bottom(why)).toBeCloseTo(12);
            expect(bottom(card) - bottom(keptFor)).toBeCloseTo(16);
        });

        it('should label each data cell with its column, 4 px above its data', async () => {
            const { harness } = await setupTest({ width: 360 });

            expect(await harness.getLabel(1, 1)).toBe('Why');
            expect(await harness.getLabel(2, 2)).toBe('Kept for');
            // Chromium lays out lines in steps of 1/64 px, so a line of 18.2 px takes 18.1875 px.
            expect((await harness.getCellBox(1, 2)).height).toBeCloseTo(CAPS_LINE + 4 + BODY_SM_LINE, 1);
        });

        it('should label the cells again when a column header or the rows change', async () => {
            const { host, harness } = await setupTest({ width: 360 });

            host.keptFor.set('Stored for');
            host.rows.update((rows) => [...rows, ['Emails to us', 'So we can answer you', '1 year']]);
            TestBed.tick();

            await expect.poll(async () => harness.getLabel(1, 2)).toBe('Stored for');
            await expect.poll(async () => harness.getLabel(3, 1)).toBe('Why');
        });
    });
});
