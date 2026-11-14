import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ButtonComponent } from './button.component';
import { ButtonKind, DEFAULT_BUTTON_KIND } from './button.types';
import { radioArgType } from '../../../.storybook/arg-types';

/** The args of a story: the inputs of the button, and the label it projects. */
type ButtonArgs = ButtonComponent & { label: string };

const meta = {
    title: 'Button',
    component: ButtonComponent,
    argTypes: {
        kind: radioArgType({
            values: ButtonKind,
            typeName: 'ButtonKind',
            defaultValue: DEFAULT_BUTTON_KIND,
            description:
                'How the button looks: primary, for the one main action of a view, secondary, for its other calls to action, or quiet, for the tools in the header and menu.',
        }),
        label: {
            description: 'The content the button projects, which names it to assistive technology.',
            control: 'text',
        },
    },
    render: (args) => ({
        props: args,
        template: `<button dma-button type="button" [kind]="kind">{{ label }}</button>`,
    }),
} satisfies Meta<ButtonArgs>;

export default meta;

type Story = StoryObj<ButtonArgs>;

const hover = { pseudo: { hover: true } };
const focus = { pseudo: { focusVisible: true } };

export const PrimaryDefault: Story = {
    args: { kind: 'primary', label: 'Label' },
};

export const PrimaryHover: Story = {
    args: { kind: 'primary', label: 'Label' },
    parameters: hover,
};

export const PrimaryFocus: Story = {
    args: { kind: 'primary', label: 'Label' },
    parameters: focus,
};

export const SecondaryDefault: Story = {
    args: { kind: 'secondary', label: 'Label' },
};

export const SecondaryHover: Story = {
    args: { kind: 'secondary', label: 'Label' },
    parameters: hover,
};

export const SecondaryFocus: Story = {
    args: { kind: 'secondary', label: 'Label' },
    parameters: focus,
};

export const QuietDefault: Story = {
    args: { kind: 'quiet', label: 'Label' },
};

export const QuietHover: Story = {
    args: { kind: 'quiet', label: 'Label' },
    parameters: hover,
};

export const QuietFocus: Story = {
    args: { kind: 'quiet', label: 'Label' },
    parameters: focus,
};

/** A button on `<a>`, which looks the same and keeps the semantics of a link. */
export const OnLink: Story = {
    args: { kind: 'primary', label: 'Label' },
    render: (args) => ({
        props: args,
        template: `<a dma-button [kind]="kind" href="#">{{ label }}</a>`,
    }),
};
