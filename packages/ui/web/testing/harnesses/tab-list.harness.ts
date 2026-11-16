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

    /** The labels of the tabs, in the order the list shows them. */
    public async getLabels(): Promise<string[]> {
        const tabs = await this.tabsLocator();

        return await Promise.all(tabs.map(async (tab) => await tab.getLabel()));
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
