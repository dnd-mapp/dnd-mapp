import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { ICONS } from './icons';

const meta = {
    title: 'Icon',
    decorators: [
        moduleMetadata({
            imports: Object.values(ICONS),
        }),
    ],
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const AllGlyphs: Story = {
    render: () => ({
        template: `
            <ul class="glyphs">
                ${Object.keys(ICONS)
                    .map(
                        (glyph) => `
                <li class="glyph">
                    <dma-icon-${glyph} />
                    <code>${glyph}</code>
                </li>`,
                    )
                    .join('')}
            </ul>
        `,
        styles: [
            `
                .glyphs {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
                    gap: var(--space-24);
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    color: var(--color-foreground-default);
                    font-family: var(--typography-caption-font-family);
                    font-size: var(--typography-caption-font-size);
                    line-height: var(--typography-caption-line-height);
                }

                .glyph {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--space-8);
                }
            `,
        ],
    }),
};

export const InheritedColor: Story = {
    render: () => ({
        template: `
            <p class="muted-text">
                <dma-icon-github />
                Muted text, and an icon in the same color
            </p>
        `,
        styles: [
            `
                .muted-text {
                    display: flex;
                    align-items: center;
                    gap: var(--space-8);
                    margin: 0;
                    color: var(--color-foreground-muted);
                    font-family: var(--typography-body-font-family);
                    font-size: var(--typography-body-font-size);
                    line-height: var(--typography-body-line-height);
                }
            `,
        ],
    }),
};
