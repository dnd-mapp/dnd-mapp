import { Component, computed, signal } from '@angular/core';
import type { TabComponent } from './tab.component';

/** Counts the panels, so each gets an id of its own. */
let panelCount = 0;

/**
 * The content that a tab shows, drawn on the `<dma-tab-panel>` it is placed on. A tab links itself to the panel, which
 * shows only while that tab is selected, and stays hidden while no tab names it. It stays in the page while hidden, so
 * its content keeps its state across a switch of tabs.
 */
@Component({
    selector: 'dma-tab-panel',
    templateUrl: './tab-panel.component.html',
    styleUrl: './tab-panel.component.scss',
    host: {
        'role': 'tabpanel',
        'tabindex': '0',
        '[id]': 'id',
        '[attr.aria-labelledby]': 'tab()?.id ?? null',
        '[hidden]': '!shown()',
    },
})
export class TabPanelComponent {
    public readonly id = `dma-tab-panel-${(panelCount++).toString()}`;

    /** The tab that names the panel, which sets itself here. */
    public readonly tab = signal<TabComponent | null>(null);

    protected readonly shown = computed(() => this.tab()?.selected() ?? false);
}
