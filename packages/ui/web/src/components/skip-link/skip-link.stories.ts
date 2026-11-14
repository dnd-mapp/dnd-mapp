import { componentWrapperDecorator, type Meta, type StoryObj } from '@storybook/angular-vite';
import { SkipLinkComponent } from './skip-link.component';

/** The args of a story: the label the skip link projects. */
type SkipLinkArgs = SkipLinkComponent & { label: string };

const meta = {
    title: 'Skip link',
    component: SkipLinkComponent,
    argTypes: {
        label: {
            description: 'The content the skip link projects, which names it to assistive technology.',
            control: 'text',
        },
    },
    // The transform makes the frame the containing block of the fixed skip link, so the link pins to the top left of
    // its story rather than of the docs page. The frame is as tall as the focused link with its offset on both sides.
    decorators: [
        componentWrapperDecorator(
            (story) =>
                `<div style="transform: translate(0); min-height: calc(var(--size-target-min) + 2 * var(--space-16))">${story}</div>`,
        ),
    ],
    render: (args) => ({
        props: args,
        template: `<a dma-skip-link href="#main">{{ label }}</a>`,
    }),
} satisfies Meta<SkipLinkArgs>;

export default meta;

type Story = StoryObj<SkipLinkArgs>;

/** The skip link before it gets focus: hidden from sight, but still in the accessibility tree. */
export const Hidden: Story = {
    args: { label: 'Skip to main content' },
};

/** The skip link with focus, the look Penpot draws. */
export const Focus: Story = {
    args: { label: 'Skip to main content' },
    parameters: { pseudo: { focus: true } },
};
