import { type Meta, type StoryObj } from '@storybook/angular-vite';
import { TextPageComponent } from './text-page.component';

const meta = {
    title: 'Regions/Text page',
    component: TextPageComponent,
    // The article holds the text of the Text page boards of Penpot.
    render: () => ({
        template: `
            <article dma-text-page>
                <header>
                    <h1>Page title</h1>
                    <p>Last updated <time datetime="2026-11-11">November 11, 2026</time></p>
                </header>
                <h2>Section heading</h2>
                <p>
                    Paragraphs use typography.body in foreground.default, at most size.measure (720 px) wide, so lines
                    stay easy to read. Keep each paragraph to one idea.
                </p>
                <p>
                    A second paragraph follows the first, space.16 below it. Headings take more space above than below,
                    so each one reads as part of the text that follows it.
                </p>
                <h3>Subheading</h3>
                <p>A subsection adds space.8 above its heading.</p>
                <h2>Another section</h2>
                <p>Sections sit space.40 apart.</p>
            </article>
        `,
    }),
} satisfies Meta<TextPageComponent>;

export default meta;

type Story = StoryObj<TextPageComponent>;

/** The article from the desktop breakpoint up, with its title, date, and prose. */
export const Desktop: Story = {};

/**
 * The article below the desktop breakpoint, with the smaller title and section headings. The docs page shows the story
 * in an iframe narrower than the breakpoint.
 */
export const Mobile: Story = {
    globals: { viewport: { value: 'mobile1', isRotated: false } },
};
