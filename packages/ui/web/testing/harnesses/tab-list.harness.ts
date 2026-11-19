import { ComponentHarness } from '@angular/cdk/testing';
import { TabHarness } from './tab.harness';

/** The divider the tab list draws under its tabs, read from the line of its background. */
export interface TabListDivider {
    color: string;
    width: number;
}

/**
 * The fade at an end of a tab list, read from the mask of its tabs: how far in pixels from that end the tabs hide, and
 * how far from it they show whole again.
 */
export interface TabListFade {
    hide: number;
    show: number;
}

export class TabListHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-tab-list';

    private readonly tabsLocator = this.locatorForAll(TabHarness);
    private readonly scrollerLocator = this.locatorFor('.tabs');

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
        const scroller = await this.scrollerLocator();
        const [scrollWidth, clientWidth] = await Promise.all([
            scroller.getProperty<number>('scrollWidth'),
            scroller.getProperty<number>('clientWidth'),
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
     * Whether the whole of the tab labeled `label` shows clear of the fades, rather than in one of them or scrolled out
     * of the list. A tab may lie a pixel into a fade, since the list scrolls by fractions of a pixel on a zoomed page.
     */
    public async isTabClear(label: string): Promise<boolean> {
        const [list, tab, fade] = await Promise.all([
            (await this.host()).getDimensions(),
            (await (await this.getTab(label)).host()).getDimensions(),
            this.getFade(),
        ]);
        const start = list.left + (fade.start?.show ?? 0);
        const end = list.left + list.width - (fade.end?.show ?? 0);

        return tab.left >= start - 1 && tab.left + tab.width <= end + 1;
    }

    /**
     * The fade at each end of the list, read from the stops of the mask over its tabs, or null at an end where the
     * tabs show up to the edge.
     */
    public async getFade(): Promise<{ start: TabListFade | null; end: TabListFade | null }> {
        const scroller = await this.scrollerLocator();
        const [mask, { width }] = await Promise.all([scroller.getCssValue('mask-image'), scroller.getDimensions()]);
        const stops = [...mask.matchAll(/\) (calc\(100% - [\d.]+px\)|[\d.]+px)/g)].map(([, stop = '']) => {
            const fromEnd = /^calc\(100% - ([\d.]+)px\)$/.exec(stop)?.[1];

            return fromEnd === undefined ? parseFloat(stop) : width - Number(fromEnd);
        });
        const [hideStart = 0, showStart = 0, showEnd = width, hideEnd = width] = stops;

        return {
            start: showStart > 0 ? { hide: hideStart, show: showStart } : null,
            end: showEnd < width ? { hide: width - hideEnd, show: width - showEnd } : null,
        };
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
        return await (await this.scrollerLocator()).getCssValue('column-gap');
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
