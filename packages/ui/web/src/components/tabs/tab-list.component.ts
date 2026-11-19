import {
    afterRenderEffect,
    Component,
    computed,
    contentChildren,
    ElementRef,
    model,
    type Signal,
    signal,
    untracked,
    viewChild,
} from '@angular/core';
import { IconChevronLeftComponent, IconChevronRightComponent } from '../icon';
import type { TabComponent } from './tab.component';
import { TAB } from './tabs.tokens';

/** The keys that move the selection, each to the index it reaches from `index` among `count` tabs. */
const MOVES: Partial<Record<string, (index: number, count: number) => number>> = {
    ArrowLeft: (index, count) => (index - 1 + count) % count,
    ArrowRight: (index, count) => (index + 1) % count,
    Home: () => 0,
    End: (_index, count) => count - 1,
};

/**
 * How far in pixels the tabs may lie past an edge and still count as at it, since a zoomed page scrolls and lays out by
 * fractions of a pixel.
 */
const TOLERANCE = 1;

/** How the list scrolls on its own: smoothly, or at once when the reader prefers reduced motion. */
function readScrollBehavior(): ScrollBehavior {
    return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
}

/**
 * The row of tabs that switches between views of the same content, drawn on the `<dma-tab-list>` it is placed on. It
 * holds the `button[dma-tab]` elements, and keeps which of them is selected as state of its own, starting on the first.
 * The arrow keys, Home, and End move the selection and the focus. Whoever places it names it with `aria-label` or
 * `aria-labelledby`.
 *
 * Whenever the selection changes, the list scrolls the selected tab fully into view, its focus ring included, however
 * the selection changed. It scrolls only itself, never the page, and leaves the focus where it was.
 *
 * When the tabs do not fit, the list scrolls sideways, and shows a scroll button at each end that has more tabs past
 * it, over a fade of its tabs. The buttons are for the pointer alone: they stay out of the tab order and the
 * accessibility tree, and a press on one leaves the focus where it was. The list watches its size and its tabs in the
 * browser only, and shows no buttons during prerendering.
 */
@Component({
    selector: 'dma-tab-list',
    templateUrl: './tab-list.component.html',
    styleUrl: './tab-list.component.scss',
    imports: [IconChevronLeftComponent, IconChevronRightComponent],
    host: {
        'role': 'tablist',
        '[class.scrolls-start]': 'scrollsStart()',
        '[class.scrolls-end]': 'scrollsEnd()',
        '(keydown)': 'move($event)',
    },
})
export class TabListComponent {
    /** The index of the selected tab. Bind it to start on another tab, or to follow the selection. */
    public readonly selected = model(0);

    private readonly tabs = contentChildren(TAB);
    private readonly tabElements: Signal<readonly ElementRef<HTMLElement>[]> = contentChildren(TAB, {
        read: ElementRef,
    });
    private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('tabs');

    /** Whether more tabs lie past the start of the list, so it shows the scroll button there. */
    protected readonly scrollsStart = signal(false);

    /** Whether more tabs lie past the end of the list, so it shows the scroll button there. */
    protected readonly scrollsEnd = signal(false);

    /**
     * Whether the list has measured itself since the browser first laid it out, so its scroll padding matches the
     * scroll buttons it shows.
     */
    private readonly measured = signal(false);

    /** The selected tab: the one at `selected`, or the first when no tab is at that index. */
    public readonly selectedTab: Signal<TabComponent | null> = computed(() => {
        const tabs = this.tabs();

        return tabs[this.selected()] ?? tabs[0] ?? null;
    });

    /**
     * Watches the size of the list and of each tab once the browser renders them, so the scroll buttons follow a resize
     * of the container, a tab that changes width, and each time the tabs change. A new observer reports every size it
     * watches at once, so a tab that leaves the list updates the buttons too.
     *
     * Once the list has measured itself, it scrolls the selected tab into view, at once on the first scroll and in the
     * way of `readScrollBehavior` after it. It scrolls again only when the selection changes, so a change of size or of
     * the tabs alone leaves the tabs where they are.
     */
    public constructor() {
        afterRenderEffect((onCleanup) => {
            const elements = [this.scroller(), ...this.tabElements()].map((element) => element.nativeElement);
            const observer = new ResizeObserver(() => {
                this.update();
                this.measured.set(true);
            });

            for (const element of elements) {
                observer.observe(element);
            }
            onCleanup(() => {
                observer.disconnect();
            });
        });

        let first = true;

        afterRenderEffect(() => {
            const tab = this.selectedTab();

            if (!this.measured() || !tab) {
                return;
            }
            untracked(() => {
                this.reveal(tab, first ? 'instant' : readScrollBehavior());
            });
            first = false;
        });
    }

    /** Selects `tab`, when it is one of the tabs of the list. */
    public select(tab: TabComponent) {
        const index = this.tabs().indexOf(tab);

        if (index !== -1) {
            this.selected.set(index);
        }
    }

    /**
     * Selects and focuses the tab a key reaches from the selected tab, as automatic activation does. The arrow keys
     * wrap at either end. A key with Alt, Ctrl, or Meta stays with the browser, such as Alt+Left for back.
     */
    protected move(event: KeyboardEvent) {
        const move = MOVES[event.key];
        const tabs = this.tabs();
        const current = this.selectedTab();

        if (!move || !current || event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }
        const tab = tabs[move(tabs.indexOf(current), tabs.length)];

        if (tab) {
            event.preventDefault();
            this.select(tab);
            tab.focus();
        }
    }

    /** Shows the scroll button at each end of the list that has more tabs past it. */
    protected update() {
        const { scrollLeft, scrollWidth, clientWidth } = this.scroller().nativeElement;

        this.scrollsStart.set(scrollLeft > TOLERANCE);
        this.scrollsEnd.set(scrollWidth - clientWidth - scrollLeft > TOLERANCE);
    }

    /**
     * Scrolls until the next tab past `edge` shows whole, clear of the scroll button and its fade there, which the
     * scroll padding of the list leaves room for. The scroll is smooth, unless the reader prefers reduced motion.
     */
    protected scroll(edge: 'start' | 'end') {
        const { start, end } = this.readClearSpan();
        const tabs = this.tabElements().map((tab) => tab.nativeElement.getBoundingClientRect());
        const distance =
            edge === 'start'
                ? (tabs.findLast((tab) => tab.left < start - TOLERANCE)?.left ?? start) - start
                : (tabs.find((tab) => tab.right > end + TOLERANCE)?.right ?? end) - end;

        this.scroller().nativeElement.scrollBy({ left: distance, behavior: readScrollBehavior() });
    }

    /**
     * Scrolls the list the least distance that shows the whole of `tab` within the scroll padding, which leaves room
     * for its focus ring and any scroll button. A tab wider than that room lines up with its start. Scrolls the list
     * alone, unlike `scrollIntoView`, which scrolls the page too.
     */
    private reveal(tab: TabComponent, behavior: ScrollBehavior) {
        const element = this.tabElements()[this.tabs().indexOf(tab)]?.nativeElement;

        if (!element) {
            return;
        }
        const { start, end } = this.readClearSpan();
        const { left, right } = element.getBoundingClientRect();
        const distance =
            left < start - TOLERANCE ? left - start : right > end + TOLERANCE ? Math.min(right - end, left - start) : 0;

        if (distance !== 0) {
            this.scroller().nativeElement.scrollBy({ left: distance, behavior });
        }
    }

    /** Where in the viewport a tab shows whole: the box of the list, less its scroll padding at each end. */
    private readClearSpan() {
        const scroller = this.scroller().nativeElement;
        const box = scroller.getBoundingClientRect();
        const { scrollPaddingLeft, scrollPaddingRight } = getComputedStyle(scroller);

        return { start: box.left + parseFloat(scrollPaddingLeft), end: box.right - parseFloat(scrollPaddingRight) };
    }
}
