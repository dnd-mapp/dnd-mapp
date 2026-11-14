import { ComponentHarness, type TestElement } from '@angular/cdk/testing';

/** How an option or the picker draws its box. */
export interface ThemePickerLook {
    background: string;
    borderColor: string;
    color: string;
}

/** The focus ring an option draws, read from its outline. */
export interface ThemePickerFocusRing {
    style: string;
    color: string;
    width: string;
    offset: string;
}

export class ThemePickerHarness extends ComponentHarness {
    public static readonly hostSelector = 'fieldset[dma-theme-picker]';

    private readonly inputLocator = this.locatorFor('input[type="radio"]');
    private readonly inputsLocator = this.locatorForAll('input[type="radio"]');

    /** The themes of the options, in the order the picker shows them. */
    public async getThemes(): Promise<string[]> {
        const inputs = await this.inputsLocator();

        return await Promise.all(inputs.map(async (input) => await input.getProperty<string>('value')));
    }

    /** The theme of the checked option, or null when none is checked. */
    public async getSelected(): Promise<string | null> {
        for (const input of await this.inputsLocator()) {
            if (await input.getProperty<boolean>('checked')) {
                return await input.getProperty<string>('value');
            }
        }
        return null;
    }

    /** The name that groups the radio inputs of the picker. */
    public async getName(): Promise<string | null> {
        return await (await this.inputLocator()).getAttribute('name');
    }

    /** How the picker draws its box. */
    public async getLook(): Promise<ThemePickerLook> {
        return await this.readLook(await this.host());
    }

    /** The width and height of the picker in pixels. */
    public async getSize(): Promise<{ width: number; height: number }> {
        const { width, height } = await (await this.host()).getDimensions();

        return { width, height };
    }

    /** How the option of `theme` draws its box. */
    public async getOptionLook(theme: string): Promise<ThemePickerLook> {
        return await this.readLook(await this.box(theme));
    }

    /** The width and height of the option of `theme` in pixels. */
    public async getOptionSize(theme: string): Promise<{ width: number; height: number }> {
        const { width, height } = await (await this.box(theme)).getDimensions();

        return { width, height };
    }

    /** The width and height of the icon of the option of `theme` in pixels. */
    public async getIconSize(theme: string): Promise<{ width: number; height: number }> {
        const icon = await this.locatorFor(`${this.boxSelector(theme)} > :first-child`)();
        const { width, height } = await icon.getDimensions();

        return { width, height };
    }

    /** Whether the option of `theme` shows its label, rather than its icon alone. */
    public async isLabelShown(theme: string): Promise<boolean> {
        const label = await this.locatorFor(`${this.boxSelector(theme)} .label`)();

        return !(await label.hasClass('cdk-visually-hidden'));
    }

    /** The focus ring the option of `theme` draws, whose style is `none` when it draws none. */
    public async getFocusRing(theme: string): Promise<ThemePickerFocusRing> {
        const box = await this.box(theme);
        const [style, color, width, offset] = await Promise.all([
            box.getCssValue('outline-style'),
            box.getCssValue('outline-color'),
            box.getCssValue('outline-width'),
            box.getCssValue('outline-offset'),
        ]);

        return { style, color, width, offset };
    }

    private boxSelector(theme: string) {
        return `input[value="${theme}"] + .box`;
    }

    private async box(theme: string) {
        return await this.locatorFor(this.boxSelector(theme))();
    }

    private async readLook(element: TestElement): Promise<ThemePickerLook> {
        const [background, borderColor, color] = await Promise.all([
            element.getCssValue('background-color'),
            element.getCssValue('border-top-color'),
            element.getCssValue('color'),
        ]);

        return { background, borderColor, color };
    }
}
