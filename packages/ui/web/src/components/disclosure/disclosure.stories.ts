import type { Meta, StoryObj } from '@storybook/angular-vite';
import { DisclosureComponent } from './disclosure.component';

/** The args of a story: whether the panel is open, and the summary and content the disclosure projects. */
type DisclosureArgs = DisclosureComponent & { open: boolean; summary: string; content: string };

const meta = {
    title: 'Patterns/Disclosure',
    component: DisclosureComponent,
    argTypes: {
        open: {
            description:
                'The `open` attribute of the `<details>`, which the browser sets as the reader opens the panel.',
            control: 'boolean',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
        },
        summary: {
            description: 'The element marked `dma-disclosure-summary`, which labels the summary.',
            control: 'text',
        },
        content: {
            description: 'The content the panel projects.',
            control: 'text',
        },
    },
    render: (args) => ({
        props: args,
        template: `
            <details dma-disclosure [open]="open">
                <span dma-disclosure-summary>{{ summary }}</span>
                <p>{{ content }}</p>
            </details>
        `,
    }),
} satisfies Meta<DisclosureArgs>;

export default meta;

type Story = StoryObj<DisclosureArgs>;

export const ClosedDefault: Story = {
    args: {
        open: false,
        summary: 'Question or heading',
        content: 'The answer or content, in one or more short paragraphs. It shows only while the disclosure is open.',
    },
};

export const ClosedHover: Story = {
    args: {
        open: false,
        summary: 'Question or heading',
        content: 'The answer or content, in one or more short paragraphs. It shows only while the disclosure is open.',
    },
    parameters: { pseudo: { hover: true } },
};

export const ClosedFocus: Story = {
    args: {
        open: false,
        summary: 'Question or heading',
        content: 'The answer or content, in one or more short paragraphs. It shows only while the disclosure is open.',
    },
    parameters: { pseudo: { focusVisible: true } },
};

export const OpenDefault: Story = {
    args: {
        open: true,
        summary: 'Question or heading',
        content: 'The answer or content, in one or more short paragraphs. It shows only while the disclosure is open.',
    },
};

export const OpenHover: Story = {
    args: {
        open: true,
        summary: 'Question or heading',
        content: 'The answer or content, in one or more short paragraphs. It shows only while the disclosure is open.',
    },
    parameters: { pseudo: { hover: true } },
};

export const OpenFocus: Story = {
    args: {
        open: true,
        summary: 'Question or heading',
        content: 'The answer or content, in one or more short paragraphs. It shows only while the disclosure is open.',
    },
    parameters: { pseudo: { focusVisible: true } },
};

/** Disclosures stacked as questions and answers, the place they are made for, with a divider under each. */
export const Stacked: Story = {
    render: () => ({
        template: `
            <details dma-disclosure>
                <span dma-disclosure-summary>What is a saving throw?</span>
                <p>A roll that decides whether a creature resists a spell, a trap, or a poison.</p>
            </details>
            <details dma-disclosure open>
                <span dma-disclosure-summary>How long is a round?</span>
                <p>About six seconds in the world of the game.</p>
                <p>Each creature in the fight takes one turn in it, in the order of initiative.</p>
            </details>
            <details dma-disclosure>
                <span dma-disclosure-summary>What does advantage do?</span>
                <p>You roll two d20s and use the higher roll.</p>
            </details>
        `,
    }),
};
