import { Component, ElementRef, inject, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '../button';
import { IconCloseComponent } from '../icon';

/**
 * The navigation of every page below the desktop breakpoint, drawn on the `<dialog>` it is placed on. Whoever places it
 * projects the link home around the logo, the nav links, and the GitHub button, and opens it with `showModal()` when
 * Header emits `menuPressed`, so the menu needs no router or app state.
 *
 * The browser opens and closes it as a modal dialog, and fires the native `close` event each time it closes, so Mobile
 * menu has no outputs of its own.
 *
 * The styles reach the projected children, which emulated encapsulation leaves out, so the component turns
 * encapsulation off and scopes every rule to its own selector instead.
 */
@Component({
    selector: 'dialog[dma-mobile-menu]',
    templateUrl: './mobile-menu.component.html',
    styleUrl: './mobile-menu.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [ButtonComponent, IconCloseComponent],
    host: { 'aria-label': 'Menu' },
})
export class MobileMenuComponent {
    private readonly dialog = inject<ElementRef<HTMLDialogElement>>(ElementRef).nativeElement;

    /**
     * Opens the menu as a modal dialog. A template reference to the menu points at the component rather than the
     * `<dialog>`, so the component passes the call on.
     */
    public showModal() {
        this.dialog.showModal();
    }

    /** Closes the menu. */
    public close() {
        this.dialog.close();
    }
}
