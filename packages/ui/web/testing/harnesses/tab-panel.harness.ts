import { ComponentHarness } from '@angular/cdk/testing';

export class TabPanelHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-tab-panel';

    /** The text of the panel. */
    public async getText(): Promise<string> {
        return await (await this.host()).text();
    }

    /** Whether the panel shows: it is not `hidden`, and draws a box. */
    public async isShown(): Promise<boolean> {
        const host = await this.host();
        const [hidden, display] = await Promise.all([host.getProperty<boolean>('hidden'), host.getCssValue('display')]);

        return !hidden && display !== 'none';
    }

    /** Whether the panel has the focus. */
    public async isFocused(): Promise<boolean> {
        return await (await this.host()).isFocused();
    }

    /** The id of the panel. */
    public async getId(): Promise<string | null> {
        return await (await this.host()).getAttribute('id');
    }

    /** The id of the tab that names the panel, from `aria-labelledby`. */
    public async getLabelledBy(): Promise<string | null> {
        return await (await this.host()).getAttribute('aria-labelledby');
    }

    /** The `tabindex` of the panel, which puts it in the tab order after its tab list. */
    public async getTabIndex(): Promise<string | null> {
        return await (await this.host()).getAttribute('tabindex');
    }
}
