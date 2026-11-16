import { Component } from '@angular/core';
import { LogoComponent } from '../logo';

/**
 * The bottom of every page, drawn on the `<footer>` it is placed on. Whoever places it projects the columns of links,
 * one `<nav>` around a Link group each. The brand, the license line, and the SRD 5.1 attribution are built in, since
 * every page shows them the same, and the license of the SRD 5.1 requires the attribution.
 */
@Component({
    selector: 'footer[dma-footer]',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    imports: [LogoComponent],
})
export class FooterComponent {}
