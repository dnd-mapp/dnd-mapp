import { Component, input } from '@angular/core';
import { DEFAULT_NAV_LINK_KIND, navLinkKindAttr } from './nav-link.types';

/**
 * A link to a page of the site in its navigation, drawn on the `<a>` it is placed on. Whoever places it adds
 * `routerLink` or `href`, so the nav link needs no router, and `aria-current="page"` on the link to the current page.
 */
@Component({
    selector: 'a[dma-nav-link]',
    templateUrl: './nav-link.component.html',
    styleUrl: './nav-link.component.scss',
    host: {
        '[class.row]': "kind() === 'row'",
    },
})
export class NavLinkComponent {
    public readonly kind = input(DEFAULT_NAV_LINK_KIND, { transform: navLinkKindAttr });
}
