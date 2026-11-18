import { componentWrapperDecorator, type Meta, type StoryObj } from '@storybook/angular-vite';
import { OnThisPageLinkComponent } from './on-this-page-link.component';

/** The args of a story: the label the link projects, and whether it marks the section in view. */
type OnThisPageLinkArgs = OnThisPageLinkComponent & { label: string; current: boolean };

const meta = {
    title: 'Patterns/On this page',
    component: OnThisPageLinkComponent,
    argTypes: {
        label: {
            description:
                'The content the link projects: the heading of its section, which names it to assistive technology.',
            control: 'text',
        },
        current: {
            description: 'Whether the link marks the section in view, through `aria-current="location"` on the link.',
            control: 'boolean',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
        },
    },
    // Draws each link in the 240 px column of Penpot, since the link fills its container.
    decorators: [componentWrapperDecorator((story) => `<div style="width: 240px">${story}</div>`)],
    render: (args) => ({
        props: args,
        template: `
            <a dma-on-this-page-link [attr.aria-current]="current ? 'location' : null" href="#section-heading">
                {{ label }}
            </a>
        `,
    }),
} satisfies Meta<OnThisPageLinkArgs>;

export default meta;

type Story = StoryObj<OnThisPageLinkArgs>;

export const LinkDefault: Story = {
    args: { label: 'Section heading', current: false },
};

export const LinkHover: Story = {
    args: { label: 'Section heading', current: false },
    parameters: { pseudo: { hover: true } },
};

export const LinkFocus: Story = {
    args: { label: 'Section heading', current: false },
    parameters: { pseudo: { focusVisible: true } },
};

export const LinkCurrent: Story = {
    args: { label: 'Section heading', current: true },
};

/** The links of the Privacy page stacked as On this page lists them, with the first section in view. */
export const Links: Story = {
    render: () => ({
        template: `
            <a dma-on-this-page-link aria-current="location" href="#who-is-responsible">Who is responsible</a>
            <a dma-on-this-page-link href="#what-we-process">What we process</a>
            <a dma-on-this-page-link href="#what-we-dont-do">What we don’t do</a>
            <a dma-on-this-page-link href="#who-else-sees-it">Who else sees it</a>
            <a dma-on-this-page-link href="#your-rights">Your rights</a>
            <a dma-on-this-page-link href="#changes-to-this-statement">Changes to this statement</a>
        `,
    }),
};
