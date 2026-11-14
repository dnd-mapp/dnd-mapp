import { type BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/** How an option draws its box. */
export interface ThemeOptionLook {
    background: string;
    borderColor: string;
    color: string;
}

/** The focus ring an option draws, read from its outline. */
export interface ThemeOptionFocusRing {
    style: string;
    color: string;
    width: string;
    offset: string;
}

/** Narrows a query for options to the option of a theme. */
export interface ThemeOptionHarnessFilters extends BaseHarnessFilters {
    theme?: string;
}

export class ThemeOptionHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-theme-option';

    private readonly inputLocator = this.locatorFor('input[type="radio"]');
    private readonly boxLocator = this.locatorFor('.box');
    private readonly iconLocator = this.locatorFor('.box > :first-child');
    private readonly labelLocator = this.locatorFor('.label');

    /** A predicate that finds the option of `theme`. */
    public static with(options: ThemeOptionHarnessFilters = {}): HarnessPredicate<ThemeOptionHarness> {
        return new HarnessPredicate(ThemeOptionHarness, options).addOption(
            'theme',
            options.theme,
            async (harness, theme) => (await harness.getTheme()) === theme,
        );
    }

    /** The theme the option picks. */
    public async getTheme(): Promise<string> {
        return await (await this.inputLocator()).getProperty<string>('value');
    }

    /** Whether the option is checked. */
    public async isChecked(): Promise<boolean> {
        return await (await this.inputLocator()).getProperty<boolean>('checked');
    }

    /** The name that groups the radio input with the other options of its picker. */
    public async getName(): Promise<string | null> {
        return await (await this.inputLocator()).getAttribute('name');
    }

    /** How the option draws its box. */
    public async getLook(): Promise<ThemeOptionLook> {
        const box = await this.boxLocator();
        const [background, borderColor, color] = await Promise.all([
            box.getCssValue('background-color'),
            box.getCssValue('border-top-color'),
            box.getCssValue('color'),
        ]);

        return { background, borderColor, color };
    }

    /** The width and height of the option in pixels. */
    public async getSize(): Promise<{ width: number; height: number }> {
        const { width, height } = await (await this.boxLocator()).getDimensions();

        return { width, height };
    }

    /** The width and height of the icon in pixels. */
    public async getIconSize(): Promise<{ width: number; height: number }> {
        const { width, height } = await (await this.iconLocator()).getDimensions();

        return { width, height };
    }

    /** Whether the option shows its label, rather than its icon alone. */
    public async isLabelShown(): Promise<boolean> {
        return !(await (await this.labelLocator()).hasClass('cdk-visually-hidden'));
    }

    /** The focus ring the option draws, whose style is `none` when it draws none. */
    public async getFocusRing(): Promise<ThemeOptionFocusRing> {
        const box = await this.boxLocator();
        const [style, color, width, offset] = await Promise.all([
            box.getCssValue('outline-style'),
            box.getCssValue('outline-color'),
            box.getCssValue('outline-width'),
            box.getCssValue('outline-offset'),
        ]);

        return { style, color, width, offset };
    }
}
