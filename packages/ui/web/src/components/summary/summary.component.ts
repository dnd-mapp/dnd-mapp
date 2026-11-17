import { afterNextRender, Component, ElementRef, inject, ViewEncapsulation } from '@angular/core';

/** Counts the summaries that name their title, so each title gets an id of its own. */
let titleCount = 0;

/**
 * A box that opens a long text page with a short version of it, drawn on the `<section>` it is placed on: a heading as
 * its title, then its points as a `<ul>`, all projected. Whoever places it picks the heading level.
 *
 * The title names the section, so assistive technology announces the summary as a region by that name. After the
 * first render, the component gives the heading an id when it has none, and points `aria-labelledby` at it, unless
 * the section already has an `aria-labelledby` of its own.
 *
 * The styles reach the projected children, which emulated encapsulation leaves out, so the component turns
 * encapsulation off and scopes every rule to its own selector instead.
 */
@Component({
    selector: 'section[dma-summary]',
    templateUrl: './summary.component.html',
    styleUrl: './summary.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class SummaryComponent {
    private readonly section = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

    public constructor() {
        afterNextRender(() => {
            this.labelByTitle();
        });
    }

    /** Points `aria-labelledby` at the heading, and gives the heading an id when it has none. */
    private labelByTitle(): void {
        const title = this.section.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)');

        if (!title || this.section.hasAttribute('aria-labelledby')) {
            return;
        }
        if (!title.id) {
            title.id = `dma-summary-title-${(titleCount++).toString()}`;
        }
        this.section.setAttribute('aria-labelledby', title.id);
    }
}
