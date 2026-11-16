import { Component, computed, forwardRef, inject, type Signal } from '@angular/core';
import { TabListComponent } from './tab-list.component';
import { TAB } from './tabs.tokens';

/**
 * A tab of a Tab list, drawn on the `<button>` it is placed on, which it keeps from submitting a form. It reads whether
 * it is selected from its tab list, and a click selects it. Only the selected tab is in the tab order.
 */
@Component({
    selector: 'button[dma-tab]',
    templateUrl: './tab.component.html',
    styleUrl: './tab.component.scss',
    providers: [{ provide: TAB, useExisting: forwardRef(() => TabComponent) }],
    host: {
        'role': 'tab',
        'type': 'button',
        '[attr.aria-selected]': 'selected()',
        '[attr.tabindex]': 'selected() ? 0 : -1',
        '(click)': 'select()',
    },
})
export class TabComponent {
    private readonly tabList = inject(TabListComponent);

    public readonly selected: Signal<boolean> = computed(() => this.tabList.selectedTab() === this);

    protected select() {
        this.tabList.select(this);
    }
}
