import { Component } from '@angular/core';

/** Counts the On this page navs, so the title of each gets an id of its own. */
let navCount = 0;

/**
 * Links to the sections of a long text page, drawn on the `<nav>` it is placed on. Whoever places it projects one
 * `<li>` per section, each holding an `a[dma-on-this-page-link]`, and the nav puts the items in a list of its own, under
 * its title. The title names the nav through `aria-labelledby`, so assistive technology announces it as the On this page
 * navigation.
 *
 * The nav fills the column the page gives it, and sticks near the top of the viewport while the article beside it
 * scrolls.
 */
@Component({
    selector: 'nav[dma-on-this-page]',
    templateUrl: './on-this-page.component.html',
    styleUrl: './on-this-page.component.scss',
    host: {
        '[attr.aria-labelledby]': 'titleId',
    },
})
export class OnThisPageComponent {
    /** The id of the title, which names the nav. */
    protected readonly titleId = `dma-on-this-page-title-${(navCount++).toString()}`;
}
