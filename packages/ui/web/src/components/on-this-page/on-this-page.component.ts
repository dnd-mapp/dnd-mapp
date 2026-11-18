import { afterNextRender, Component, contentChildren, DestroyRef, DOCUMENT, ElementRef, inject } from '@angular/core';
import { OnThisPageLinkComponent } from './on-this-page-link.component';

/** Counts the On this page navs, so the title of each gets an id of its own. */
let navCount = 0;

/**
 * Where a heading counts as reached: from far above the top of the document down to a third of the way down the
 * viewport. Reaching up past the top keeps a heading the reader has scrolled past reached, so a jump of the page, such
 * as to its end, moves the mark as well.
 */
const REACHED_AREA = '1000000px 0px -67% 0px';

/** A link of the nav, and the heading of its section. */
interface Section {
    link: HTMLAnchorElement;
    heading: HTMLElement;
}

/**
 * Links to the sections of a long text page, drawn on the `<nav>` it is placed on. Whoever places it projects one
 * `<li>` per section, each holding an `a[dma-on-this-page-link]` to the id of the heading of its section, and the nav
 * puts the items in a list of its own, under its title. The title names the nav through `aria-labelledby`, so
 * assistive technology announces it as the On this page navigation.
 *
 * The nav marks the link of the section in view with `aria-current="location"`: the last section whose heading has
 * reached the top third of the viewport, or the first section before the reader reaches it. It never marks a link
 * whose heading is missing from the page. It watches the headings once it has rendered in the browser, so it renders on
 * the server with no link marked. A heading counts as reached once the document scrolls it up, so the page scrolls the
 * document rather than a container of its own.
 *
 * The nav fills the column the page gives it, and sticks near the top of the viewport while the article beside it
 * scrolls.
 */
@Component({
    selector: 'nav[dma-on-this-page]',
    templateUrl: './on-this-page.component.html',
    styleUrl: './on-this-page.component.scss',
    host: {
        '[attr.aria-labelledby]': 'titleId',
    },
})
export class OnThisPageComponent {
    /** The id of the title, which names the nav. */
    protected readonly titleId = `dma-on-this-page-title-${(navCount++).toString()}`;

    private readonly document = inject(DOCUMENT);
    private readonly links = contentChildren<OnThisPageLinkComponent, ElementRef<HTMLAnchorElement>>(
        OnThisPageLinkComponent,
        { descendants: true, read: ElementRef },
    );

    public constructor() {
        const destroyRef = inject(DestroyRef);

        afterNextRender(() => {
            const sections = this.findSections();
            const reached = new Set<Element>();
            const observer = new IntersectionObserver(
                (entries) => {
                    for (const { target, isIntersecting } of entries) {
                        if (isIntersecting) {
                            reached.add(target);
                        } else {
                            reached.delete(target);
                        }
                    }
                    this.mark(sections, sections.findLast(({ heading }) => reached.has(heading)) ?? sections[0]);
                },
                { root: this.document, rootMargin: REACHED_AREA },
            );

            for (const { heading } of sections) {
                observer.observe(heading);
            }
            destroyRef.onDestroy(() => {
                observer.disconnect();
            });
        });
    }

    /** The links whose heading is on the page, each with its heading, in the order of the links. */
    private findSections(): Section[] {
        return this.links().flatMap(({ nativeElement: link }) => {
            const id = decodeURIComponent(link.hash.slice(1));
            const heading = id ? this.document.getElementById(id) : null;

            return heading ? [{ link, heading }] : [];
        });
    }

    /** Marks the link of `current` as the section in view, and the other links as not. */
    private mark(sections: Section[], current: Section | undefined): void {
        for (const { link } of sections) {
            if (link === current?.link) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        }
    }
}
