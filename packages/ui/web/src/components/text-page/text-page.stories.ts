import { type Meta, type StoryObj } from '@storybook/angular-vite';
import { TextPageComponent } from './text-page.component';

const meta = {
    title: 'Regions/Text page',
    component: TextPageComponent,
    // The dashed box stands in for the prose of the page.
    render: () => ({
        template: `
            <article dma-text-page>
                <header>
                    <h1>Page title</h1>
                    <p>Last updated <time datetime="2026-11-11">November 11, 2026</time></p>
                </header>
                <div class="slot">Prose</div>
            </article>
        `,
        styles: [
            `
                .slot {
                    display: grid;
                    place-items: center;
                    box-sizing: border-box;
                    min-block-size: 12.5rem;
                    border: var(--border-width-default) dashed var(--color-border-control);
                    border-radius: var(--radius-lg);
                    color: var(--color-foreground-muted);
                    font-size: var(--typography-body-sm-font-size);
                }
            `,
        ],
    }),
} satisfies Meta<TextPageComponent>;

export default meta;

type Story = StoryObj<TextPageComponent>;

/** The article from the desktop breakpoint up, with its title and date above the prose. */
export const Desktop: Story = {};

/**
 * The article below the desktop breakpoint, with the smaller title. The docs page shows the story in an iframe narrower
 * than the breakpoint.
 */
export const Mobile: Story = {
    globals: { viewport: { value: 'mobile1', isRotated: false } },
};
