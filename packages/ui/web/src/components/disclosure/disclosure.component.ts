import { Component, ViewEncapsulation } from '@angular/core';
import { IconMinusComponent, IconPlusComponent } from '../icon';

/**
 * Content that opens on demand, such as the answer to a question, drawn on the `<details>` it is placed on. The
 * component renders the `<summary>`, which projects the element marked `dma-disclosure-summary` as its label, and
 * projects the rest of the content into the panel. The browser opens and closes it, and its `open` attribute and
 * `toggle` event are the state and the event of the disclosure.
 *
 * The styles reach the projected content of the panel, which emulated encapsulation leaves out, so the component turns
 * encapsulation off and scopes every rule to its own selector instead.
 */
@Component({
    selector: 'details[dma-disclosure]',
    templateUrl: './disclosure.component.html',
    styleUrl: './disclosure.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [IconMinusComponent, IconPlusComponent],
})
export class DisclosureComponent {}
