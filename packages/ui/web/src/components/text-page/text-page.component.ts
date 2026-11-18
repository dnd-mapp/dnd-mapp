import { Component, ViewEncapsulation } from '@angular/core';

/**
 * The article of a long text page, such as a policy or a guide, drawn on the `<article>` it is placed on. Whoever places
 * it projects a `<header>` with the title of the page as its `<h1>` and the date it was last updated as a `<p>`, then
 * the prose as plain headings, paragraphs, and lists. It may also project a `nav[dma-on-this-page]` with links to the
 * sections of the prose, and a `section[dma-summary]` that opens the page with a short version of it. The article
 * draws the header first, then the nav, the summary, and the prose, whatever the order of the content.
 *
 * The article fills its container up to the measure. From the desktop breakpoint up, the nav moves to a column of its
 * own beside the rest, where it sticks while the article scrolls, and the article grows by that column. Its type sizes
 * follow the Viewport tokens, so it needs no input for the viewport.
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
