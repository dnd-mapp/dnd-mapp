import { Component, ViewEncapsulation } from '@angular/core';
import { LogoComponent } from '../logo';
import { ThemePickerComponent } from '../theme-picker';

/**
 * The bottom of every page, drawn on the `<footer>` it is placed on. Whoever places it projects the columns of links,
 * one `<nav>` around a Link group each. The brand, the license line, the SRD 5.1 attribution, and the Theme picker are
 * built in, since every page shows them the same, and the license of the SRD 5.1 requires the attribution.
 *
 * The styles reach the options of the Theme picker, which emulated encapsulation leaves out, so the component turns
 * encapsulation off and scopes every rule to its own selector instead.
 */
@Component({
    selector: 'footer[dma-footer]',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    imports: [LogoComponent, ThemePickerComponent],
    encapsulation: ViewEncapsulation.None,
})
export class FooterComponent {}
