import { ComponentHarness } from '@angular/cdk/testing';
import { TabHarness } from './tab.harness';

/** The divider the tab list draws along its bottom edge, read from its inset shadow. */
export interface TabListDivider {
    color: string;
    width: number;
}

export class TabListHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-tab-list';

    private readonly tabsLocator = this.locatorForAll(TabHarness);

    /** The tabs of the list, in the order it shows them. */
    public async getTabs(): Promise<TabHarness[]> {
        return await this.tabsLocator();
    }

    /** The tab labeled `label`. */
    public async getTab(label: string): Promise<TabHarness> {
        return await this.locatorFor(TabHarness.with({ label }))();
    }

    /** The labels of the tabs, in the order the list shows them. */
    public async getLabels(): Promise<string[]> {
        const tabs = await this.tabsLocator();

        return await Promise.all(tabs.map(async (tab) => await tab.getLabel()));
    }

    /** The label of the selected tab, or null when none is selected. */
    public async getSelectedLabel(): Promise<string | null> {
        for (const tab of await this.tabsLocator()) {
            if (await tab.isSelected()) {
                return await tab.getLabel();
            }
        }
        return null;
    }

    /** The label of the tab that has the focus, or null when none has it. */
    public async getFocusedLabel(): Promise<string | null> {
        for (const tab of await this.tabsLocator()) {
            if (await tab.isFocused()) {
                return await tab.getLabel();
            }
        }
        return null;
    }

    /** Whether the tabs are wider than the list, so it scrolls sideways. */
    public async isScrollable(): Promise<boolean> {
        const host = await this.host();
        const [scrollWidth, clientWidth] = await Promise.all([
            host.getProperty<number>('scrollWidth'),
            host.getProperty<number>('clientWidth'),
        ]);

        return scrollWidth > clientWidth;
    }

    /** Whether the whole of the tab labeled `label` shows within the list, rather than scrolled out of it. */
    public async isTabInView(label: string): Promise<boolean> {
        const [list, tab] = await Promise.all([
            (await this.host()).getDimensions(),
            (await (await this.getTab(label)).host()).getDimensions(),
        ]);

        return tab.left >= list.left && tab.left + tab.width <= list.left + list.width;
    }

    /** The width and height of the tab list in pixels. */
    public async getSize(): Promise<{ width: number; height: number }> {
        const { width, height } = await (await this.host()).getDimensions();

        return { width, height };
    }

    /** The gap between the tabs. */
    public async getGap(): Promise<string> {
        return await (await this.host()).getCssValue('column-gap');
    }

    /** The divider along the bottom edge, or null when the list draws none. */
    public async getDivider(): Promise<TabListDivider | null> {
        const shadow = await (await this.host()).getCssValue('box-shadow');
        const match = /^(rgba?\([^)]*\)) 0px (-?[\d.]+)px 0px 0px inset$/.exec(shadow);

        return match ? { color: match[1] ?? '', width: -Number(match[2]) } : null;
    }
}
