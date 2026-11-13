import { Component, input } from '@angular/core';
import { DEFAULT_LINK_KIND, linkKindAttr } from './link.types';
import { IconArrowRightComponent } from '../icon';

/**
 * A link to another page or site, drawn on the `<a>` it is placed on. Whoever places it adds `routerLink` or `href`,
 * so the link needs no router.
 */
@Component({
    selector: 'a[dma-link]',
    templateUrl: './link.component.html',
    styleUrl: './link.component.scss',
    imports: [IconArrowRightComponent],
    host: {
        '[class.standalone]': "kind() === 'standalone'",
        '[class.quiet]': "kind() === 'quiet'",
    },
})
export class LinkComponent {
    public readonly kind = input(DEFAULT_LINK_KIND, { transform: linkKindAttr });
}
