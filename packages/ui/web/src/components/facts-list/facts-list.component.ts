import { Component, ViewEncapsulation } from '@angular/core';

/**
 * Pairs of a term and a value, drawn on the `<dl>` it is placed on. Each pair is a `<div>` that projects a `<dt>` and a
 * `<dd>`. From the desktop breakpoint up, each term sits beside its value; below it, above its value.
 *
 * The styles reach the projected children, which emulated encapsulation leaves out, so the component turns
 * encapsulation off and scopes every rule to its own selector instead.
 */
@Component({
    selector: 'dl[dma-facts-list]',
    templateUrl: './facts-list.component.html',
    styleUrl: './facts-list.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class FactsListComponent {}
