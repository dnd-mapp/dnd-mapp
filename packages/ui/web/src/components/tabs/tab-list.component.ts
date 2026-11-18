import {
    afterNextRender,
    Component,
    computed,
    contentChildren,
    DestroyRef,
    type ElementRef,
    inject,
    model,
    type Signal,
    signal,
    viewChild,
} from '@angular/core';
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

/**
 * The row of tabs that switches between views of the same content, drawn on the `<dma-tab-list>` it is placed on. It
 * holds the `button[dma-tab]` elements, and keeps which of them is selected as state of its own, starting on the first.
 * The arrow keys, Home, and End move the selection and the focus. Whoever places it names it with `aria-label` or
 * `aria-labelledby`.
 *
 * When the tabs do not fit, the list scrolls sideways, and fades its tabs out at each end that has more tabs past it.
 * The list watches its size in the browser only, and draws no fade during prerendering.
 */
@Component({
    selector: 'dma-tab-list',
    templateUrl: './tab-list.component.html',
    styleUrl: './tab-list.component.scss',
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
    private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('tabs');

    /** Whether more tabs lie past the start of the list, so it fades its tabs out there. */
    protected readonly scrollsStart = signal(false);

    /** Whether more tabs lie past the end of the list, so it fades its tabs out there. */
    protected readonly scrollsEnd = signal(false);

    /** The selected tab: the one at `selected`, or the first when no tab is at that index. */
    public readonly selectedTab: Signal<TabComponent | null> = computed(() => {
        const tabs = this.tabs();

        return tabs[this.selected()] ?? tabs[0] ?? null;
    });

    public constructor() {
        const destroyRef = inject(DestroyRef);

        afterNextRender(() => {
            const observer = new ResizeObserver(() => {
                this.update();
            });

            observer.observe(this.scroller().nativeElement);
            destroyRef.onDestroy(() => {
                observer.disconnect();
            });
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

    /** Fades the tabs out at each end of the list that has more tabs past it. */
    protected update() {
        const { scrollLeft, scrollWidth, clientWidth } = this.scroller().nativeElement;

        this.scrollsStart.set(scrollLeft > TOLERANCE);
        this.scrollsEnd.set(scrollWidth - clientWidth - scrollLeft > TOLERANCE);
    }
}
