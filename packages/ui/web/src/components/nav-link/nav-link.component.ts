import { Component, input } from '@angular/core';
import { DEFAULT_NAV_LINK_KIND, navLinkKindAttr } from './nav-link.types';

/**
 * A link to a page of the site in its navigation, drawn on the `<a>` it is placed on. Whoever places it adds
 * `routerLink` or `href`, so the nav link needs no router.
 */
@Component({
    selector: 'a[dma-nav-link]',
    templateUrl: './nav-link.component.html',
    styleUrl: './nav-link.component.scss',
})
export class NavLinkComponent {
    public readonly kind = input(DEFAULT_NAV_LINK_KIND, { transform: navLinkKindAttr });
}
