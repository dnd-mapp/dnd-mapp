import { ComponentHarness, type TestElement } from '@angular/cdk/testing';

/** The icon at the end of the summary of a disclosure. */
export type DisclosureIcon = 'plus' | 'minus';

const ICONS: DisclosureIcon[] = ['plus', 'minus'];

/** How a disclosure draws the fill and the text of its summary or its panel. */
export interface DisclosureLook {
    background: string;
    color: string;
    fontWeight: string;
}

/** The height in pixels, the padding, and the corners of the summary of a disclosure. */
export interface DisclosureSummaryBox {
    height: number;
    padding: string;
    borderRadius: string;
}

/** The focus ring the summary of a disclosure draws, read from its outline. */
export interface DisclosureFocusRing {
    style: string;
    color: string;
    width: string;
    offset: string;
}

/** The line under a disclosure, read from its bottom border. */
export interface DisclosureDivider {
    style: string;
    color: string;
    width: string;
}

export class DisclosureHarness extends ComponentHarness {
    public static readonly hostSelector = 'details[dma-disclosure]';

    private readonly summaryLocator = this.locatorFor(':scope > summary');
    private readonly labelLocator = this.locatorFor(':scope > summary > .label');
    private readonly panelLocator = this.locatorFor(':scope > .panel');
    private readonly iconLocators: Record<DisclosureIcon, () => Promise<TestElement | null>> = {
        plus: this.locatorForOptional(':scope > summary > dma-icon-plus'),
        minus: this.locatorForOptional(':scope > summary > dma-icon-minus'),
    };

    /** The label of the summary, which names it to assistive technology. */
    public async getSummaryText(): Promise<string> {
        return await (await this.labelLocator()).text();
    }

    /** The text of the panel, whether it is open or closed. */
    public async getPanelText(): Promise<string> {
        return await (await this.panelLocator()).text();
    }

    /** Whether the panel is open. */
    public async isOpen(): Promise<boolean> {
        return await (await this.host()).getProperty<boolean>('open');
    }

    /** The icon that the summary shows, or null when it shows none or more than one. */
    public async getIcon(): Promise<DisclosureIcon | null> {
        const shown = await Promise.all(ICONS.map(async (icon) => await isShown(await this.iconLocators[icon]())));
        const [icon, ...others] = ICONS.filter((_, index) => shown[index]);

        return icon && others.length === 0 ? icon : null;
    }

    /** How the summary draws its fill and its label. */
    public async getSummaryLook(): Promise<DisclosureLook> {
        return await getLook(await this.summaryLocator());
    }

    /** How the panel draws its fill and its text. */
    public async getPanelLook(): Promise<DisclosureLook> {
        return await getLook(await this.panelLocator());
    }

    /** The height, padding, and corners of the summary. */
    public async getSummaryBox(): Promise<DisclosureSummaryBox> {
        const summary = await this.summaryLocator();
        const [{ height }, padding, borderRadius] = await Promise.all([
            summary.getDimensions(),
            summary.getCssValue('padding'),
            summary.getCssValue('border-radius'),
        ]);

        return { height, padding, borderRadius };
    }

    /** The focus ring the summary draws, whose style is `none` when it draws none. */
    public async getFocusRing(): Promise<DisclosureFocusRing> {
        const summary = await this.summaryLocator();
        const [style, color, width, offset] = await Promise.all([
            summary.getCssValue('outline-style'),
            summary.getCssValue('outline-color'),
            summary.getCssValue('outline-width'),
            summary.getCssValue('outline-offset'),
        ]);

        return { style, color, width, offset };
    }

    /** The width and height of the disclosure, in pixels. */
    public async getSize(): Promise<{ width: number; height: number }> {
        const { width, height } = await (await this.host()).getDimensions();

        return { width, height };
    }

    /** The line under the disclosure. */
    public async getDivider(): Promise<DisclosureDivider> {
        const host = await this.host();
        const [style, color, width] = await Promise.all([
            host.getCssValue('border-bottom-style'),
            host.getCssValue('border-bottom-color'),
            host.getCssValue('border-bottom-width'),
        ]);

        return { style, color, width };
    }

    /**
     * Whether find in page can reach the text of the panel while it is closed. No test can drive find in page, so this
     * checks what it needs: the panel holds text and stays in the `<details>`, which hides it only in its own content
     * slot, and the panel hides none of it through its display, visibility, content visibility, or `inert`.
     */
    public async isPanelFindable(): Promise<boolean> {
        const panel = await this.panelLocator();
        const [text, display, visibility, contentVisibility, inert] = await Promise.all([
            panel.text(),
            panel.getCssValue('display'),
            panel.getCssValue('visibility'),
            panel.getCssValue('content-visibility'),
            panel.getProperty<boolean>('inert'),
        ]);

        return (
            text.trim() !== '' &&
            display !== 'none' &&
            visibility !== 'hidden' &&
            contentVisibility !== 'hidden' &&
            !inert
        );
    }
}

async function getLook(element: TestElement): Promise<DisclosureLook> {
    const [background, color, fontWeight] = await Promise.all([
        element.getCssValue('background-color'),
        element.getCssValue('color'),
        element.getCssValue('font-weight'),
    ]);

    return { background, color, fontWeight };
}

async function isShown(element: TestElement | null): Promise<boolean> {
    return element !== null && (await element.getCssValue('display')) !== 'none';
}
