import type { Meta, StoryObj } from '@storybook/angular-vite';
import { NavLinkComponent } from './nav-link.component';
import { DEFAULT_NAV_LINK_KIND, NavLinkKind } from './nav-link.types';
import { radioArgType } from '../../../.storybook/arg-types';

/** The args of a story: the inputs of the nav link, the label it projects, and whether it marks the current page. */
type NavLinkArgs = NavLinkComponent & { label: string; current: boolean };

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
        current: {
            description: 'Whether the nav link marks the current page, through `aria-current="page"` on the link.',
            control: 'boolean',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
        },
    },
    render: (args) => ({
        props: args,
        template: `<a dma-nav-link [kind]="kind" [attr.aria-current]="current ? 'page' : null" href="#">{{ label }}</a>`,
    }),
} satisfies Meta<NavLinkArgs>;

export default meta;

type Story = StoryObj<NavLinkArgs>;

export const BarDefault: Story = {
    args: { kind: 'bar', label: 'Features', current: false },
};

export const BarHover: Story = {
    args: { kind: 'bar', label: 'Features', current: false },
    parameters: { pseudo: { hover: true } },
};

export const BarFocus: Story = {
    args: { kind: 'bar', label: 'Features', current: false },
    parameters: { pseudo: { focusVisible: true } },
};

export const BarCurrent: Story = {
    args: { kind: 'bar', label: 'Features', current: true },
};

export const BarCurrentHover: Story = {
    args: { kind: 'bar', label: 'Features', current: true },
    parameters: { pseudo: { hover: true } },
};

export const BarCurrentFocus: Story = {
    args: { kind: 'bar', label: 'Features', current: true },
    parameters: { pseudo: { focusVisible: true } },
};

/** The nav links of the header, with the first one on the current page. */
export const InHeader: Story = {
    render: () => ({
        template: `
            <nav aria-label="Main" style="display: flex; gap: var(--space-4)">
                <a dma-nav-link aria-current="page" href="#">Features</a>
                <a dma-nav-link href="#">Roadmap</a>
                <a dma-nav-link href="#">FAQ</a>
            </nav>
        `,
    }),
};
