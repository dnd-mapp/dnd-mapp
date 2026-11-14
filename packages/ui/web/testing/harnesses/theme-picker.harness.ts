import { ComponentHarness } from '@angular/cdk/testing';
import { ThemeOptionHarness } from './theme-option.harness';

/** How the picker draws its box. */
export interface ThemePickerLook {
    background: string;
    borderColor: string;
}

export class ThemePickerHarness extends ComponentHarness {
    public static readonly hostSelector = 'fieldset[dma-theme-picker]';

    private readonly optionsLocator = this.locatorForAll(ThemeOptionHarness);

    /** The options of the picker, in the order it shows them. */
    public async getOptions(): Promise<ThemeOptionHarness[]> {
        return await this.optionsLocator();
    }

    /** The option of `theme`. */
    public async getOption(theme: string): Promise<ThemeOptionHarness> {
        return await this.locatorFor(ThemeOptionHarness.with({ theme }))();
    }

    /** The themes of the options, in the order the picker shows them. */
    public async getThemes(): Promise<string[]> {
        const options = await this.optionsLocator();

        return await Promise.all(options.map(async (option) => await option.getTheme()));
    }

    /** The theme of the checked option, or null when none is checked. */
    public async getSelected(): Promise<string | null> {
        for (const option of await this.optionsLocator()) {
            if (await option.isChecked()) {
                return await option.getTheme();
            }
        }
        return null;
    }

    /** The names that group the radio inputs of the options, one for each option. */
    public async getNames(): Promise<(string | null)[]> {
        const options = await this.optionsLocator();

        return await Promise.all(options.map(async (option) => await option.getName()));
    }

    /** How the picker draws its box. */
    public async getLook(): Promise<ThemePickerLook> {
        const host = await this.host();
        const [background, borderColor] = await Promise.all([
            host.getCssValue('background-color'),
            host.getCssValue('border-top-color'),
        ]);

        return { background, borderColor };
    }

    /** The width and height of the picker in pixels. */
    public async getSize(): Promise<{ width: number; height: number }> {
        const { width, height } = await (await this.host()).getDimensions();

        return { width, height };
    }
}
