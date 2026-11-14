import { Component } from '@angular/core';

/**
 * The first focusable item of a page, drawn on the `<a>` it is placed on. It stays hidden until it gets focus, then
 * pins to the top left of the viewport. Whoever places it sets `href` to the id of the main content, such as `#main`.
 */
@Component({
    selector: 'a[dma-skip-link]',
    templateUrl: './skip-link.component.html',
    styleUrl: './skip-link.component.scss',
})
export class SkipLinkComponent {}
