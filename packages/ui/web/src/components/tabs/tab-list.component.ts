import { Component, computed, contentChildren, model, type Signal } from '@angular/core';
import type { TabComponent } from './tab.component';
import { TAB } from './tabs.tokens';

/**
 * The row of tabs that switches between views of the same content, drawn on the `<dma-tab-list>` it is placed on. It
 * holds the `button[dma-tab]` elements, and keeps which of them is selected as state of its own, starting on the first.
 * Whoever places it names it with `aria-label` or `aria-labelledby`.
 */
@Component({
    selector: 'dma-tab-list',
    templateUrl: './tab-list.component.html',
    styleUrl: './tab-list.component.scss',
    host: {
        role: 'tablist',
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
}
