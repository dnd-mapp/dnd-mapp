import { Component, ViewEncapsulation } from '@angular/core';

/**
 * Rows of data under a header row, drawn on the `<table>` it is placed on. The table projects a `<caption>`, a
 * `<thead>` with one row of `<th scope="col">`, and a `<tbody>` whose rows start with a `<th scope="row">`. The caption
 * names the table for assistive technology and stays out of sight.
 *
 * The styles reach the projected children, which emulated encapsulation leaves out, so the component turns
 * encapsulation off and scopes every rule to its own selector instead.
 */
@Component({
    selector: 'table[dma-data-table]',
    templateUrl: './data-table.component.html',
    styleUrl: './data-table.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class DataTableComponent {}
