import { Component, output, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '../button';
import { IconMenuComponent } from '../icon';
import { ThemePickerComponent } from '../theme-picker';

/**
 * The bar at the top of every page, drawn on the `<header>` it is placed on. Whoever places it projects the link home
 * around the logo, the nav links, and the GitHub button, and opens Mobile menu when the header emits `menuPressed`, so
 * the header needs no router or app state. The Theme picker saves the choice of the reader itself.
 *
 * Below the desktop breakpoint, the header shows the link home and the Menu button. From the breakpoint up, it shows
 * the nav links, the GitHub button, and the Theme picker instead of the Menu button.
 *
 * The styles reach the projected children, which emulated encapsulation leaves out, so the component turns
 * encapsulation off and scopes every rule to its own selector instead.
 */
@Component({
    selector: 'header[dma-header]',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [ButtonComponent, IconMenuComponent, ThemePickerComponent],
})
export class HeaderComponent {
    /** Emits each time the reader presses the Menu button. */
    public readonly menuPressed = output();
}
