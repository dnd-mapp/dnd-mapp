import { afterNextRender, Component, DestroyRef, ElementRef, inject, ViewEncapsulation } from '@angular/core';
import { desktopBreakpoint } from '@dnd-mapp/design-tokens/breakpoints';
import { ButtonComponent } from '../button';
import { IconCloseComponent } from '../icon';
import { ThemePickerComponent } from '../theme-picker';

/**
 * The navigation of every page below the desktop breakpoint, drawn on the `<dialog>` it is placed on. Whoever places it
 * projects the link home around the logo, the nav links, and the GitHub button, and opens it with `showModal()` when
 * Header emits `menuPressed`, so the menu needs no router or app state. The Close button and the Theme picker below the
 * GitHub button are built in, since every page shows them the same.
 *
 * The browser does the rest of the work of a modal dialog: it focuses Close, the child marked `autofocus`, keeps focus
 * inside, makes the page behind inert, closes the menu on Escape, and returns focus to the Menu button once the menu
 * closes. The native `close` event fires each time the menu closes, so Mobile menu has no outputs of its own.
 *
 * Header shows the desktop nav from the desktop breakpoint up, so the menu closes itself when the window grows past it,
 * rather than covering that nav and keeping the page behind inert. It watches the breakpoint in the browser only, and
 * does nothing during prerendering.
 *
 * The styles reach the projected children and the options of the Theme picker, which emulated encapsulation leaves out,
 * so the component turns encapsulation off and scopes every rule to its own selector instead.
 */
@Component({
    selector: 'dialog[dma-mobile-menu]',
    templateUrl: './mobile-menu.component.html',
    styleUrl: './mobile-menu.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [ButtonComponent, IconCloseComponent, ThemePickerComponent],
    host: { 'aria-label': 'Menu' },
})
export class MobileMenuComponent {
    private readonly dialog = inject<ElementRef<HTMLDialogElement>>(ElementRef).nativeElement;

    public constructor() {
        const destroyRef = inject(DestroyRef);

        afterNextRender(() => {
            const desktop = matchMedia(`(min-width: ${desktopBreakpoint})`);
            const onChange = ({ matches }: MediaQueryListEvent) => {
                if (matches) {
                    this.dialog.close();
                }
            };

            desktop.addEventListener('change', onChange);
            destroyRef.onDestroy(() => {
                desktop.removeEventListener('change', onChange);
            });
        });
    }

    /**
     * Opens the menu as a modal dialog, which moves focus to the Close button. A template reference to the menu points
     * at the component rather than the `<dialog>`, so the component passes the call on.
     */
    public showModal() {
        this.dialog.showModal();
    }

    /** Closes the menu, which returns focus to the element that had it before the menu opened. */
    public close() {
        this.dialog.close();
    }
}
