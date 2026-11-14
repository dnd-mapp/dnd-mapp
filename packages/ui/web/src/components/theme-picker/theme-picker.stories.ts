import { type Signal, signal } from '@angular/core';
import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular-vite';
import { ThemePickerComponent } from './theme-picker.component';
import { DEFAULT_THEME_PICKER_DISPLAY, ThemePickerDisplay } from './theme-picker.types';
import { radioArgType } from '../../../.storybook/arg-types';
import { Theme, ThemeService } from '../../theme';

/**
 * Stands in for `ThemeService`, so each story picks the option it shows as selected, and a click moves the selection
 * without changing the theme of the preview, which the theme toolbar owns.
 */
class StoryThemeService {
    private readonly _theme = signal<Theme>(Theme.System);

    public readonly theme: Signal<Theme> = this._theme.asReadonly();

    constructor(selected: Theme) {
        this._theme.set(selected);
    }

    public setTheme(theme: Theme): void {
        this._theme.set(theme);
    }
}

/** Provides a `StoryThemeService` that reports `selected`. */
function withSelected(selected: Theme) {
    return applicationConfig({
        providers: [{ provide: ThemeService, useFactory: () => new StoryThemeService(selected) }],
    });
}

const meta = {
    title: 'Theme picker',
    component: ThemePickerComponent,
    argTypes: {
        display: radioArgType({
            values: ThemePickerDisplay,
            typeName: 'ThemePickerDisplay',
            defaultValue: DEFAULT_THEME_PICKER_DISPLAY,
            description: 'How the options show: each icon with its label, or the icons alone where space is tight.',
        }),
    },
    decorators: [withSelected(Theme.System)],
    render: (args) => ({
        props: args,
        template: `<fieldset dma-theme-picker [display]="display"></fieldset>`,
    }),
} satisfies Meta<ThemePickerComponent>;

export default meta;

type Story = StoryObj<ThemePickerComponent>;

// The args spell out the display rather than reading ThemePickerDisplay: the code snippet of a story follows only
// constants of this file, so it would print the imported constant into a template that cannot resolve it. Each story
// selects System, as Penpot does. The pseudo parameter of storybook-addon-pseudo-states draws the hover state on
// Light, and the focus state on System, where keyboard focus lands since it is selected.

const hover = { pseudo: { hover: 'label:has(input[value="light"])' } };
const focus = { pseudo: { focusVisible: 'input[value="system"]' } };

export const LabelsDefault: Story = {
    args: { display: 'labels' },
};

export const LabelsHover: Story = {
    args: { display: 'labels' },
    parameters: hover,
};

export const LabelsFocus: Story = {
    args: { display: 'labels' },
    parameters: focus,
};

export const IconsDefault: Story = {
    args: { display: 'icons' },
};

export const IconsHover: Story = {
    args: { display: 'icons' },
    parameters: hover,
};

export const IconsFocus: Story = {
    args: { display: 'icons' },
    parameters: focus,
};

/** Dark selected, as the picker shows it to a reader who picked Dark. */
export const DarkSelected: Story = {
    args: { display: 'labels' },
    decorators: [withSelected(Theme.Dark)],
};
