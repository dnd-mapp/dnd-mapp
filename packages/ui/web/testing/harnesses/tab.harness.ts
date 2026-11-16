import { type BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/** Filters a tab by its label. */
export interface TabHarnessFilters extends BaseHarnessFilters {
    label?: string | RegExp;
}

/** How a tab draws its label and its fill. */
export interface TabLook {
    background: string;
    color: string;
    fontWeight: string;
}

/** The size and the corners of the box of a tab. */
export interface TabBox {
    height: number;
    paddingLeft: string;
    paddingRight: string;
    borderRadius: string;
}

/** The indicator of the selected tab, with its place and size in pixels relative to the top left of the tab. */
export interface TabIndicator {
    color: string;
    left: number;
    top: number;
    width: number;
    height: number;
}

export class TabHarness extends ComponentHarness {
    public static readonly hostSelector = 'button[dma-tab]';

    private readonly indicatorLocator = this.locatorFor('.indicator');

    /** Matches the tabs with the label of `options`. */
    public static with(options: TabHarnessFilters = {}): HarnessPredicate<TabHarness> {
        return new HarnessPredicate(TabHarness, options).addOption(
            'label',
            options.label,
            async (harness, label) => await HarnessPredicate.stringMatches(harness.getLabel(), label),
        );
    }

    /** The label of the tab, which names it to assistive technology. */
    public async getLabel(): Promise<string> {
        return await (await this.host()).text();
    }

    /** Selects the tab with a click. */
    public async click(): Promise<void> {
        await (await this.host()).click();
    }

    /** Whether the tab is selected, through `aria-selected`. */
    public async isSelected(): Promise<boolean> {
        return (await (await this.host()).getAttribute('aria-selected')) === 'true';
    }

    /** The id of the tab. */
    public async getId(): Promise<string | null> {
        return await (await this.host()).getAttribute('id');
    }

    /** The id of the panel the tab shows, from `aria-controls`. */
    public async getControls(): Promise<string | null> {
        return await (await this.host()).getAttribute('aria-controls');
    }

    /** The `tabindex` of the tab, which keeps only the selected tab in the tab order. */
    public async getTabIndex(): Promise<string | null> {
        return await (await this.host()).getAttribute('tabindex');
    }

    /** How the tab draws its label and its fill. */
    public async getLook(): Promise<TabLook> {
        const host = await this.host();
        const [background, color, fontWeight] = await Promise.all([
            host.getCssValue('background-color'),
            host.getCssValue('color'),
            host.getCssValue('font-weight'),
        ]);

        return { background, color, fontWeight };
    }

    /** The height in pixels, the inline padding, and the corners of the tab. */
    public async getBox(): Promise<TabBox> {
        const host = await this.host();
        const [{ height }, paddingLeft, paddingRight, borderRadius] = await Promise.all([
            host.getDimensions(),
            host.getCssValue('padding-left'),
            host.getCssValue('padding-right'),
            host.getCssValue('border-radius'),
        ]);

        return { height, paddingLeft, paddingRight, borderRadius };
    }

    /** The width and height of the tab in pixels. */
    public async getSize(): Promise<{ width: number; height: number }> {
        const { width, height } = await (await this.host()).getDimensions();

        return { width, height };
    }

    /** The indicator of the selected tab, or null when the tab draws none. */
    public async getIndicator(): Promise<TabIndicator | null> {
        const indicator = await this.indicatorLocator();

        if ((await indicator.getCssValue('display')) === 'none') {
            return null;
        }
        const [tab, box, color] = await Promise.all([
            (await this.host()).getDimensions(),
            indicator.getDimensions(),
            indicator.getCssValue('background-color'),
        ]);

        return { color, left: box.left - tab.left, top: box.top - tab.top, width: box.width, height: box.height };
    }
}
