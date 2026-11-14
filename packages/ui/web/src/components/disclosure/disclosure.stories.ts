import type { Meta, StoryObj } from '@storybook/angular-vite';
import { DisclosureComponent } from './disclosure.component';

/** The args of a story: the summary and the content the disclosure projects. */
type DisclosureArgs = DisclosureComponent & { summary: string; content: string };

const meta = {
    title: 'Disclosure',
    component: DisclosureComponent,
    argTypes: {
        summary: {
            description: 'The element marked `dma-disclosure-summary`, which labels the summary.',
            control: 'text',
        },
        content: {
            description: 'The content the disclosure projects after the summary.',
            control: 'text',
        },
    },
    args: {
        summary: 'Question or heading',
        content: 'The answer or content, in one or more short paragraphs. It shows only while the disclosure is open.',
    },
    render: (args) => ({
        props: args,
        template: `
            <details dma-disclosure>
                <span dma-disclosure-summary>{{ summary }}</span>
                <p>{{ content }}</p>
            </details>
        `,
    }),
} satisfies Meta<DisclosureArgs>;

export default meta;

type Story = StoryObj<DisclosureArgs>;

export const ClosedDefault: Story = {};
