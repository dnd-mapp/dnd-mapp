import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LinkComponent } from './link.component';
import { DEFAULT_LINK_KIND, LinkKind } from './link.types';
import { radioArgType } from '../../../.storybook/arg-types';

/** The args of a story: the inputs of the link, and the label it projects. */
type LinkArgs = LinkComponent & { label: string };

const meta = {
    title: 'Link',
    component: LinkComponent,
    argTypes: {
        kind: radioArgType({
            values: LinkKind,
            typeName: 'LinkKind',
            defaultValue: DEFAULT_LINK_KIND,
            description:
                'How the link looks: inline in a line of text, standalone on a line of its own with an arrow, or quiet in a list of links.',
        }),
        label: {
            description: 'The content the link projects, which names it to assistive technology.',
            control: 'text',
        },
    },
    render: (args) => ({
        props: args,
        template: `<a dma-link [kind]="kind" href="#">{{ label }}</a>`,
    }),
} satisfies Meta<LinkArgs>;

export default meta;

type Story = StoryObj<LinkArgs>;

// The args spell out the kind rather than reading LinkKind: the code snippet of a story follows only constants of this
// file, so it would print the imported constant into a template that cannot resolve it. Each label is the one of the
// variant in Penpot. The pseudo parameter of storybook-addon-pseudo-states draws the hover and focus states.

const hover = { pseudo: { hover: true } };
const focus = { pseudo: { focusVisible: true } };

export const InlineDefault: Story = {
    args: { kind: 'inline', label: 'link text' },
};

export const InlineHover: Story = {
    args: { kind: 'inline', label: 'link text' },
    parameters: hover,
};

export const InlineFocus: Story = {
    args: { kind: 'inline', label: 'link text' },
    parameters: focus,
};

export const StandaloneDefault: Story = {
    args: { kind: 'standalone', label: 'Label' },
};

export const StandaloneHover: Story = {
    args: { kind: 'standalone', label: 'Label' },
    parameters: hover,
};

export const StandaloneFocus: Story = {
    args: { kind: 'standalone', label: 'Label' },
    parameters: focus,
};

export const QuietDefault: Story = {
    args: { kind: 'quiet', label: 'Link' },
};

export const QuietHover: Story = {
    args: { kind: 'quiet', label: 'Link' },
    parameters: hover,
};

export const QuietFocus: Story = {
    args: { kind: 'quiet', label: 'Link' },
    parameters: focus,
};

/** An inline link in a paragraph of body text, the place it is made for. */
export const InText: Story = {
    args: { kind: 'inline', label: 'the rules glossary' },
    render: (args) => ({
        props: args,
        template: `<p class="body-text">Each spell lists its range and duration, as <a dma-link [kind]="kind" href="#">{{ label }}</a> explains.</p>`,
        styles: [
            `
                .body-text {
                    margin: 0;
                    max-width: var(--size-measure);
                }
            `,
        ],
    }),
};
