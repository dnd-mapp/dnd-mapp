import { componentWrapperDecorator, type Meta, type StoryObj } from '@storybook/angular-vite';
import { CardComponent } from './card.component';
import { CardBackground, DEFAULT_CARD_BACKGROUND } from './card.types';
import { radioArgType } from '../../../.storybook/arg-types';

/** The args of a story: the inputs of the card, and the text of each part it projects. */
type CardArgs = CardComponent & { title: string; text: string };

const meta = {
    title: 'Card',
    component: CardComponent,
    argTypes: {
        background: radioArgType({
            values: CardBackground,
            typeName: 'CardBackground',
            defaultValue: DEFAULT_CARD_BACKGROUND,
            description:
                'What the card fills itself with, by what it sits on: surface, on the page background, or raised, on a surface.',
        }),
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
                <dma-card [background]="background">
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
export const Surface: Story = {
    args: { background: 'surface' },
};

/** A card on a surface, which the story draws around it, so the card stands one step above its background. */
export const Raised: Story = {
    args: { background: 'raised' },
    decorators: [
        componentWrapperDecorator(
            (story) =>
                `<div style="padding: var(--space-24); border-radius: var(--radius-lg); background: var(--color-background-surface)">${story}</div>`,
        ),
    ],
};
