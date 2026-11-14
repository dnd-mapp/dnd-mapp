import { Component, inject, input } from '@angular/core';
import { DEFAULT_THEME_PICKER_DISPLAY, themePickerDisplayAttr } from './theme-picker.types';
import { Theme, ThemeService } from '../../theme';
import { IconMonitorComponent, IconMoonComponent, IconSunComponent } from '../icon';

/** An option of the picker: the theme it picks, and the label that names it. */
interface ThemeOption {
    theme: Theme;
    label: string;
}

/** The options in the order Penpot draws them. */
const OPTIONS: readonly ThemeOption[] = [
    { theme: Theme.System, label: 'System' },
    { theme: Theme.Light, label: 'Light' },
    { theme: Theme.Dark, label: 'Dark' },
];

/** Counts the pickers, so each gives its radio inputs a name of its own. */
let pickerCount = 0;

/**
 * Lets the reader pick System, Light, or Dark, drawn on the `<fieldset>` it is placed on. Each option is a native radio
 * input, so the arrow keys move the choice. It reads and saves the choice through `ThemeService`, the one exception to
 * the presentational components of this package that ADR 0001 records, so whoever places it needs no wiring.
 */
@Component({
    selector: 'fieldset[dma-theme-picker]',
    templateUrl: './theme-picker.component.html',
    styleUrl: './theme-picker.component.scss',
    imports: [IconMonitorComponent, IconMoonComponent, IconSunComponent],
    host: {
        '[class.icons]': "display() === 'icons'",
    },
})
export class ThemePickerComponent {
    private readonly themeService = inject(ThemeService);

    public readonly display = input(DEFAULT_THEME_PICKER_DISPLAY, { transform: themePickerDisplayAttr });

    protected readonly options = OPTIONS;
    protected readonly theme = this.themeService.theme;

    /** The name of the radio inputs, which groups them apart from those of every other picker on the page. */
    protected readonly name = `dma-theme-picker-${(pickerCount++).toString()}`;

    protected select(theme: Theme) {
        this.themeService.setTheme(theme);
    }
}
