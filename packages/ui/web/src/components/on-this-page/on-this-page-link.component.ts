import { Component } from '@angular/core';

/**
 * A link to a section of the page in On this page, drawn on the `<a>` it is placed on. Whoever places it adds the
 * `href` of the section, such as `#your-rights`, and `aria-current="location"` on the link of the section in view.
 */
@Component({
    selector: 'a[dma-on-this-page-link]',
    templateUrl: './on-this-page-link.component.html',
    styleUrl: './on-this-page-link.component.scss',
})
export class OnThisPageLinkComponent {}
