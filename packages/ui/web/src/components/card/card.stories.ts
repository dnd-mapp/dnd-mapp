import type { Meta, StoryObj } from '@storybook/angular-vite';
import { CardComponent } from './card.component';

/** The args of a story: the text of each part the card projects. */
interface CardArgs {
    title: string;
    text: string;
}

const meta = {
    title: 'Card',
    component: CardComponent,
    argTypes: {
        title: { description: 'The heading the card projects, at the level the page needs.', control: 'text' },
        text: { description: 'The `<p>` the card projects below the title.', control: 'text' },
    },
    args: {
        title: 'Card title',
        text: 'A sentence or two of supporting text that explains the title.',
    },
    render: (args) => ({
        props: args,
        template: `
            <div class="column">
                <dma-card>
                    <h3>{{ title }}</h3>
                    <p>{{ text }}</p>
                </dma-card>
            </div>
        `,
        styles: [
            `
                .column {
                    max-inline-size: 36rem;
                }
            `,
        ],
    }),
} satisfies Meta<CardArgs>;

export default meta;

type Story = StoryObj<CardArgs>;

/** A card on the page background, with its title and text, as Penpot draws it by default. */
export const Surface: Story = {};
