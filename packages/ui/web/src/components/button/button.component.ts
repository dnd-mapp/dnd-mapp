import { Component, input } from '@angular/core';
import { buttonKindAttr, DEFAULT_BUTTON_KIND } from './button.types';

/**
 * An action, drawn on the `<button>` or `<a>` it is placed on, so the element keeps its native semantics and keyboard
 * behavior. Whoever places it handles the click, or adds `routerLink` or `href` to an `<a>`, so the button needs no
 * router.
 */
@Component({
    selector: 'button[dma-button], a[dma-button]',
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    host: {
        '[class.secondary]': "kind() === 'secondary'",
        '[class.quiet]': "kind() === 'quiet'",
    },
})
export class ButtonComponent {
    public readonly kind = input(DEFAULT_BUTTON_KIND, { transform: buttonKindAttr });
}
