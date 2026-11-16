import { Component, computed, effect, ElementRef, forwardRef, inject, input, type Signal } from '@angular/core';
import { TabListComponent } from './tab-list.component';
import type { TabPanelComponent } from './tab-panel.component';
import { TAB } from './tabs.tokens';

/** Counts the tabs, so each gets an id of its own. */
let tabCount = 0;

/**
 * A tab of a Tab list, drawn on the `<button>` it is placed on, which names the panel it shows through a template
 * reference. It reads whether it is selected from its tab list, and links itself to its panel, so whoever places it
 * writes no ids or ARIA attributes. Only the selected tab is in the tab order.
 */
@Component({
    selector: 'button[dma-tab]',
    templateUrl: './tab.component.html',
    styleUrl: './tab.component.scss',
    providers: [{ provide: TAB, useExisting: forwardRef(() => TabComponent) }],
    host: {
        'role': 'tab',
        'type': 'button',
        '[id]': 'id',
        '[attr.aria-selected]': 'selected()',
        '[attr.aria-controls]': 'panel().id',
        '[attr.tabindex]': 'selected() ? 0 : -1',
        '(click)': 'select()',
    },
})
export class TabComponent {
    private readonly tabList = inject(TabListComponent);
    private readonly host = inject<ElementRef<HTMLButtonElement>>(ElementRef);

    /** The panel the tab shows while it is selected. */
    public readonly panel = input.required<TabPanelComponent>();

    public readonly id = `dma-tab-${(tabCount++).toString()}`;

    public readonly selected: Signal<boolean> = computed(() => this.tabList.selectedTab() === this);

    constructor() {
        effect((onCleanup) => {
            const panel = this.panel();

            panel.tab.set(this);
            onCleanup(() => {
                panel.tab.set(null);
            });
        });
    }

    /**
     * Moves the focus to the tab, and scrolls the whole of it into view when the tab list scrolls. Focus alone leaves a
     * tab that shows in part where it is.
     */
    public focus() {
        const element = this.host.nativeElement;

        element.focus({ preventScroll: true });
        element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    protected select() {
        this.tabList.select(this);
    }
}
