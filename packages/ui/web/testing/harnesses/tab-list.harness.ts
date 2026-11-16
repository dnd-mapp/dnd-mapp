import { ComponentHarness } from '@angular/cdk/testing';
import { TabHarness } from './tab.harness';

/** The divider the tab list draws under its tabs, read from the line of its background. */
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

    /**
     * The width and height in pixels the tab list takes in its container: its box, less the room for the focus ring it
     * reaches past the container by.
     */
    public async getSize(): Promise<{ width: number; height: number }> {
        const host = await this.host();
        const [{ width, height }, ...margins] = await Promise.all([
            host.getDimensions(),
            ...['margin-top', 'margin-right', 'margin-bottom', 'margin-left'].map(
                async (property) => await host.getCssValue(property),
            ),
        ]);
        const [top, right, bottom, left] = margins.map((margin) => parseFloat(margin));

        return { width: width + (left ?? 0) + (right ?? 0), height: height + (top ?? 0) + (bottom ?? 0) };
    }

    /**
     * Whether the focus ring of the tab labeled `label` shows whole within the list, which clips what it scrolls. Only a
     * tab with keyboard focus draws its ring.
     */
    public async isFocusRingInView(label: string): Promise<boolean> {
        const tab = await this.getTab(label);
        const [list, box, { width, offset }] = await Promise.all([
            (await this.host()).getDimensions(),
            (await tab.host()).getDimensions(),
            tab.getFocusRing(),
        ]);
        const room = parseFloat(width) + parseFloat(offset);

        return (
            box.left - room >= list.left &&
            box.left + box.width + room <= list.left + list.width &&
            box.top - room >= list.top &&
            box.top + box.height + room <= list.top + list.height
        );
    }

    /** The gap between the tabs. */
    public async getGap(): Promise<string> {
        return await (await this.host()).getCssValue('column-gap');
    }

    /** The divider under the tabs, or null when the list draws none. */
    public async getDivider(): Promise<TabListDivider | null> {
        const host = await this.host();
        const [image, size] = await Promise.all([
            host.getCssValue('background-image'),
            host.getCssValue('background-size'),
        ]);
        const color = /^linear-gradient\((rgba?\([^)]*\)), \1\)$/.exec(image)?.[1];
        const width = / ([\d.]+)px$/.exec(size)?.[1];

        return color && width ? { color, width: Number(width) } : null;
    }
}
