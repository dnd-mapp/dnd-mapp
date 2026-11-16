import { Component, computed, contentChildren, model, type Signal } from '@angular/core';
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
 * The row of tabs that switches between views of the same content, drawn on the `<dma-tab-list>` it is placed on. It
 * holds the `button[dma-tab]` elements, and keeps which of them is selected as state of its own, starting on the first.
 * The arrow keys, Home, and End move the selection and the focus. Whoever places it names it with `aria-label` or
 * `aria-labelledby`.
 */
@Component({
    selector: 'dma-tab-list',
    templateUrl: './tab-list.component.html',
    styleUrl: './tab-list.component.scss',
    host: {
        'role': 'tablist',
        '(keydown)': 'move($event)',
    },
})
export class TabListComponent {
    /** The index of the selected tab. Bind it to start on another tab, or to follow the selection. */
    public readonly selected = model(0);

    private readonly tabs = contentChildren(TAB);

    /** The selected tab: the one at `selected`, or the first when no tab is at that index. */
    public readonly selectedTab: Signal<TabComponent | null> = computed(() => {
        const tabs = this.tabs();

        return tabs[this.selected()] ?? tabs[0] ?? null;
    });

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
}
