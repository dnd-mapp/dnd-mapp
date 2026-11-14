import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import { DEFAULT_THEME_PICKER_DISPLAY, themePickerDisplayAttr } from './theme-picker.types';
import { Theme } from '../../theme';
import { IconMonitorComponent, IconMoonComponent, IconSunComponent } from '../icon';

/** The label that names the option of each theme. */
const LABELS: Record<Theme, string> = {
    [Theme.System]: 'System',
    [Theme.Light]: 'Light',
    [Theme.Dark]: 'Dark',
};

/**
 * An option of the Theme picker: a native radio input inside its label. It draws the default, hover, focus, and
 * selected states of the Theme option in Penpot, and leaves the choice to the picker.
 */
@Component({
    selector: 'dma-theme-option',
    templateUrl: './theme-option.component.html',
    styleUrl: './theme-option.component.scss',
    imports: [IconMonitorComponent, IconMoonComponent, IconSunComponent],
    host: {
        '[class.icons]': "display() === 'icons'",
    },
})
export class ThemeOptionComponent {
    public readonly theme = input.required<Theme>();

    /** The name of the radio input, which groups it with the other options of its picker. */
    public readonly name = input.required<string>();

    public readonly checked = input(false, { transform: booleanAttribute });

    public readonly display = input(DEFAULT_THEME_PICKER_DISPLAY, { transform: themePickerDisplayAttr });

    /** Emits the theme of the option when the reader picks it. */
    public readonly picked = output<Theme>();

    protected readonly label = computed(() => LABELS[this.theme()]);
}
