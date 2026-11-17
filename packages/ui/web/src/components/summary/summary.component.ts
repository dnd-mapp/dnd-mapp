import { Component, contentChild, ViewEncapsulation } from '@angular/core';
import { SummaryTitleComponent } from './summary-title.component';

/**
 * A box that opens a long text page with a short version of it, drawn on the `<section>` it is placed on: a
 * `dma-summary-title` heading as its title, then its points as a `<ul>`, all projected. Whoever places it picks the
 * heading level.
 *
 * The title names the section through `aria-labelledby`, so assistive technology announces the summary as a region by
 * that name. A summary without a title throws NG0951.
 *
 * The styles reach the projected children, which emulated encapsulation leaves out, so the component turns
 * encapsulation off and scopes every rule to its own selector instead.
 */
@Component({
    selector: 'section[dma-summary]',
    templateUrl: './summary.component.html',
    styleUrl: './summary.component.scss',
    encapsulation: ViewEncapsulation.None,
    host: {
        '[attr.aria-labelledby]': 'title().id()',
    },
})
export class SummaryComponent {
    /** The heading that names the summary. */
    protected readonly title = contentChild.required(SummaryTitleComponent);
}
