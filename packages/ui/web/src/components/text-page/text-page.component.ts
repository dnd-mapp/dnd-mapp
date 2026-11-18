import { Component, ViewEncapsulation } from '@angular/core';

/**
 * The article of a long text page, such as a policy or a guide, drawn on the `<article>` it is placed on. Whoever places
 * it projects a `<header>` with the title of the page as its `<h1>` and the date it was last updated as a `<p>`, then
 * the prose as plain headings and paragraphs. The article draws the header first, whatever the order of the content,
 * and stacks the prose under it.
 *
 * The article fills its container up to the measure. Its type sizes follow the Viewport tokens, so it needs no input
 * for the viewport.
 *
 * The styles reach the projected elements, which emulated encapsulation leaves out, so the component turns
 * encapsulation off and scopes every rule to its own selector instead.
 */
@Component({
    selector: 'article[dma-text-page]',
    templateUrl: './text-page.component.html',
    styleUrl: './text-page.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class TextPageComponent {}
