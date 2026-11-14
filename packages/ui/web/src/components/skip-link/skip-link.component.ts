import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, inject } from '@angular/core';

/**
 * The first focusable item of a page, drawn on the `<a>` it is placed on. It stays hidden until it gets focus, then
 * pins to the top left of the viewport. Whoever places it sets `href` to the id of the main content, such as `#main`.
 */
@Component({
    selector: 'a[dma-skip-link]',
    templateUrl: './skip-link.component.html',
    styleUrl: './skip-link.component.scss',
    host: {
        '(click)': 'skipToTarget($event)',
    },
})
export class SkipLinkComponent {
    private readonly document = inject(DOCUMENT);
    private readonly host = inject<ElementRef<HTMLAnchorElement>>(ElementRef);

    /**
     * Moves focus to the element that `href` names, rather than following the link. The `<base href="/">` of the app
     * would resolve `#main` against the root, which leaves any other page. The target gets `tabindex="-1"` until it
     * loses focus when it can't take focus by itself, as `<main>` can't.
     */
    protected skipToTarget(event: MouseEvent): void {
        const href = this.host.nativeElement.getAttribute('href');

        if (!href?.startsWith('#')) {
            return;
        }
        const target = this.document.getElementById(decodeURIComponent(href.slice(1)));

        if (!target) {
            return;
        }
        event.preventDefault();

        if (!target.hasAttribute('tabindex')) {
            target.setAttribute('tabindex', '-1');
            target.addEventListener(
                'blur',
                () => {
                    target.removeAttribute('tabindex');
                },
                { once: true },
            );
        }
        target.focus();
    }
}
