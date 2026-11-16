import { componentWrapperDecorator, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular-vite';
import { CardComponent } from './card.component';
import { CardBackground, DEFAULT_CARD_BACKGROUND } from './card.types';
import { ChipComponent } from '../chip';
import { LinkComponent } from '../link';
import { radioArgType } from '../../../.storybook/arg-types';

/** The args of a story: the inputs of the card, and the text of each part it projects. */
type CardArgs = CardComponent & { title: string; text: string };

const meta = {
    title: 'Card',
    component: CardComponent,
    decorators: [moduleMetadata({ imports: [ChipComponent, LinkComponent] })],
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
    args: {
        background: 'surface',
        title: 'Card title',
        text: 'A sentence or two of supporting text that explains the title.',
    },
};

/** A card on a surface, which the story draws around it, so the card stands one step above its background. */
export const Raised: Story = {
    args: {
        background: 'raised',
        title: 'Card title',
        text: 'A sentence or two of supporting text that explains the title.',
    },
    decorators: [
        componentWrapperDecorator(
            (story) =>
                `<div style="padding: var(--space-24); border-radius: var(--radius-lg); background: var(--color-background-surface)">${story}</div>`,
        ),
    ],
};

/** A grid of cards in a list, each in an `<li>` of its own, with and without chips and an action. */
export const Examples: Story = {
    render: () => ({
        template: `
            <ul class="cards" role="list">
                <li>
                    <dma-card>
                        <h3>Characters</h3>
                        <p>Build character sheets and keep their spell books.</p>
                        <dma-chip>Players</dma-chip>
                        <dma-chip kind="dm">DM</dma-chip>
                        <a dma-link kind="standalone" href="#">Open your characters</a>
                    </dma-card>
                </li>
                <li>
                    <dma-card>
                        <h3>Worlds and campaigns</h3>
                        <p>Write the lore of your world, draw its maps, and keep notes of every session.</p>
                        <a dma-link kind="standalone" href="#">Start a world</a>
                    </dma-card>
                </li>
                <li>
                    <dma-card>
                        <h3>Encounters</h3>
                        <p>Build encounters and write stats for custom monsters.</p>
                        <dma-chip kind="status">Planned</dma-chip>
                    </dma-card>
                </li>
            </ul>
        `,
        styles: [
            `
                .cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(var(--size-card-min), 1fr));
                    gap: var(--space-24);
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }

                .cards > li {
                    display: grid;
                }
            `,
        ],
    }),
};
