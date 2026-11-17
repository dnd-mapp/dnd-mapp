import { afterNextRender, Component, DestroyRef, ElementRef, inject, ViewEncapsulation } from '@angular/core';

/**
 * Rows of data under a header row, drawn on the `<table>` it is placed on. The table projects a `<caption>`, a
 * `<thead>` with one row of `<th scope="col">`, and a `<tbody>` whose rows start with a `<th scope="row">`. The caption
 * names the table for assistive technology and stays out of sight.
 *
 * From the desktop breakpoint up, the rows sit under the header row; below it, each row is a card that draws the label
 * of its column above each cell. The component copies the text of each column header onto the cells of its column, as
 * `data-label`, for the styles to draw. The card layout drops the table semantics of the elements in some browsers, so
 * the component also sets the role of the table, of each row group and row, and of each cell.
 *
 * The styles reach the projected children, which emulated encapsulation leaves out, so the component turns
 * encapsulation off and scopes every rule to its own selector instead.
 */
@Component({
    selector: 'table[dma-data-table]',
    templateUrl: './data-table.component.html',
    styleUrl: './data-table.component.scss',
    encapsulation: ViewEncapsulation.None,
    host: { role: 'table' },
})
export class DataTableComponent {
    private readonly table = inject<ElementRef<HTMLTableElement>>(ElementRef).nativeElement;

    public constructor() {
        const destroyRef = inject(DestroyRef);

        afterNextRender(() => {
            this.describeCells();

            // The observer leaves attributes out, so the attributes it sets start no new pass.
            const observer = new MutationObserver(() => {
                this.describeCells();
            });

            observer.observe(this.table, { childList: true, characterData: true, subtree: true });
            destroyRef.onDestroy(() => {
                observer.disconnect();
            });
        });
    }

    /** Sets the role of each row group, row, and cell, and the label of its column on each data cell. */
    private describeCells(): void {
        const { tHead, tBodies } = this.table;
        const labels = Array.from(tHead?.rows[0]?.cells ?? [], (cell) => cell.textContent.replace(/\s+/g, ' ').trim());

        for (const group of [tHead, ...Array.from(tBodies)]) {
            if (!group) {
                continue;
            }
            group.setAttribute('role', 'rowgroup');

            for (const row of Array.from(group.rows)) {
                row.setAttribute('role', 'row');

                for (const cell of Array.from(row.cells)) {
                    if (cell.tagName === 'TD') {
                        cell.setAttribute('role', 'cell');
                        cell.setAttribute('data-label', labels[cell.cellIndex] ?? '');
                    } else {
                        cell.setAttribute('role', group === tHead ? 'columnheader' : 'rowheader');
                    }
                }
            }
        }
    }
}
