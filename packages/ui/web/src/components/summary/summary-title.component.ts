import { Component, input } from '@angular/core';

/** Counts the summary titles, so each gets an id of its own. */
let titleCount = 0;

/**
 * The title of a Summary, drawn on the heading it is placed on, at the level its consumer picks. It binds an id, which
 * the summary points `aria-labelledby` at. The Summary styles draw it.
 */
@Component({
    selector:
        'h1[dma-summary-title], h2[dma-summary-title], h3[dma-summary-title], h4[dma-summary-title], h5[dma-summary-title], h6[dma-summary-title]',
    templateUrl: './summary-title.component.html',
    host: {
        '[id]': 'id()',
    },
})
export class SummaryTitleComponent {
    /** The id of the heading. Set one for a link to the summary; the title generates one otherwise. */
    public readonly id = input(`dma-summary-title-${(titleCount++).toString()}`);
}
