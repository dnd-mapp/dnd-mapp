import { Component, output, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '../button';
import { IconMenuComponent } from '../icon';

/**
 * The bar at the top of every page, drawn on the `<header>` it is placed on. Whoever places it projects the link home
 * around the logo, and opens Mobile menu when the header emits `menuPressed`, so the header needs no router or app
 * state.
 *
 * The styles reach the projected link home, which emulated encapsulation leaves out, so the component turns
 * encapsulation off and scopes every rule to its own selector instead.
 */
@Component({
    selector: 'header[dma-header]',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [ButtonComponent, IconMenuComponent],
})
export class HeaderComponent {
    /** Emits each time the reader presses the Menu button. */
    public readonly menuPressed = output();
}
