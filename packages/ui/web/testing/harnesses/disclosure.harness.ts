import { ComponentHarness, type TestElement } from '@angular/cdk/testing';

/** The icon at the end of the summary of a disclosure. */
export type DisclosureIcon = 'plus' | 'minus';

const ICONS: DisclosureIcon[] = ['plus', 'minus'];

/** How a disclosure draws the text of its summary. */
export interface DisclosureLook {
    color: string;
    fontWeight: string;
}

/** The height in pixels, the padding, and the corners of the summary of a disclosure. */
export interface DisclosureSummaryBox {
    height: number;
    padding: string;
    borderRadius: string;
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
    private readonly iconLocators: Record<DisclosureIcon, () => Promise<TestElement | null>> = {
        plus: this.locatorForOptional(':scope > summary > dma-icon-plus'),
        minus: this.locatorForOptional(':scope > summary > dma-icon-minus'),
    };

    /** The label of the summary, which names it to assistive technology. */
    public async getSummaryText(): Promise<string> {
        return await (await this.labelLocator()).text();
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

    /** How the summary draws its label. */
    public async getSummaryLook(): Promise<DisclosureLook> {
        const summary = await this.summaryLocator();
        const [color, fontWeight] = await Promise.all([
            summary.getCssValue('color'),
            summary.getCssValue('font-weight'),
        ]);

        return { color, fontWeight };
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
}

async function isShown(element: TestElement | null): Promise<boolean> {
    return element !== null && (await element.getCssValue('display')) !== 'none';
}
