import { Component } from '@angular/core';

/** A tab of a Tab list, drawn on the `<button>` it is placed on, which it keeps from submitting a form. */
@Component({
    selector: 'button[dma-tab]',
    templateUrl: './tab.component.html',
    styleUrl: './tab.component.scss',
    host: {
        role: 'tab',
        type: 'button',
    },
})
export class TabComponent {}
