import { Component, ViewEncapsulation } from '@angular/core';

/**
 * A titled list of related links, such as a column of the footer. Whoever places it projects a heading and one `<li>`
 * per link, and the link group puts the items in a list of its own, so the links always reach assistive technology as
 * a list. The heading keeps the level its consumer picks.
 *
 * The styles reach the projected children, which emulated encapsulation leaves out, so the component turns
 * encapsulation off and scopes every rule to its own selector instead.
 */
@Component({
    selector: 'dma-link-group',
    templateUrl: './link-group.component.html',
    styleUrl: './link-group.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class LinkGroupComponent {}
