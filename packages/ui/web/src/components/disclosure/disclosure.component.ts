import { Component } from '@angular/core';
import { IconPlusComponent } from '../icon';

/**
 * Content that opens on demand, such as the answer to a question, drawn on the `<details>` it is placed on. The
 * component renders the `<summary>`, which projects the element marked `dma-disclosure-summary` as its label, and
 * projects the rest of the content after it. The browser opens and closes it, and its `open` attribute and `toggle`
 * event are the state and the event of the disclosure.
 */
@Component({
    selector: 'details[dma-disclosure]',
    templateUrl: './disclosure.component.html',
    styleUrl: './disclosure.component.scss',
    imports: [IconPlusComponent],
})
export class DisclosureComponent {}
