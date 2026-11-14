import type { Meta, StoryObj } from '@storybook/angular-vite';
import { NavLinkComponent } from './nav-link.component';
import { DEFAULT_NAV_LINK_KIND, NavLinkKind } from './nav-link.types';
import { radioArgType } from '../../../.storybook/arg-types';

/** The args of a story: the inputs of the nav link, and the label it projects. */
type NavLinkArgs = NavLinkComponent & { label: string };

const meta = {
    title: 'Nav link',
    component: NavLinkComponent,
    argTypes: {
        kind: radioArgType({
            values: NavLinkKind,
            typeName: 'NavLinkKind',
            defaultValue: DEFAULT_NAV_LINK_KIND,
            description: 'How the nav link looks: in the bar of the header, as wide as its label.',
        }),
        label: {
            description: 'The content the nav link projects, which names it to assistive technology.',
            control: 'text',
        },
    },
    render: (args) => ({
        props: args,
        template: `<a dma-nav-link [kind]="kind" href="#">{{ label }}</a>`,
    }),
} satisfies Meta<NavLinkArgs>;

export default meta;

type Story = StoryObj<NavLinkArgs>;

export const BarDefault: Story = {
    args: { kind: 'bar', label: 'Features' },
};

export const BarHover: Story = {
    args: { kind: 'bar', label: 'Features' },
    parameters: { pseudo: { hover: true } },
};

export const BarFocus: Story = {
    args: { kind: 'bar', label: 'Features' },
    parameters: { pseudo: { focusVisible: true } },
};
