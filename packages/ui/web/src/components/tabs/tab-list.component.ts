import { Component } from '@angular/core';

/**
 * The row of tabs that switches between views of the same content, drawn on the `<dma-tab-list>` it is placed on. It
 * holds the `button[dma-tab]` elements. Whoever places it names it with `aria-label` or `aria-labelledby`.
 */
@Component({
    selector: 'dma-tab-list',
    templateUrl: './tab-list.component.html',
    styleUrl: './tab-list.component.scss',
    host: {
        role: 'tablist',
    },
})
export class TabListComponent {}
