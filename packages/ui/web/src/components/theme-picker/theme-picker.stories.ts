import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ThemePickerComponent } from './theme-picker.component';
import { DEFAULT_THEME_PICKER_DISPLAY, ThemePickerDisplay } from './theme-picker.types';
import { radioArgType } from '../../../.storybook/arg-types';
import { withSelectedTheme } from '../../../.storybook/theme';
import { Theme } from '../../theme';

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
    decorators: [withSelectedTheme(Theme.System)],
    render: (args) => ({
        props: args,
        template: `<fieldset dma-theme-picker [display]="display"></fieldset>`,
    }),
} satisfies Meta<ThemePickerComponent>;

export default meta;

type Story = StoryObj<ThemePickerComponent>;

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
    decorators: [withSelectedTheme(Theme.Dark)],
};
