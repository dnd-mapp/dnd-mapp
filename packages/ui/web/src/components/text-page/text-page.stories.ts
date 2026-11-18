import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular-vite';
import { TextPageComponent } from './text-page.component';
import { LinkComponent } from '../link';

const meta = {
    title: 'Regions/Text page',
    component: TextPageComponent,
    decorators: [moduleMetadata({ imports: [LinkComponent] })],
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
                <p>Lists hold short, parallel items:</p>
                <ul role="list">
                    <li>Each item starts with a marker in foreground.muted.</li>
                    <li>Items sit space.8 apart.</li>
                    <li>Use a numbered list when the order matters.</li>
                </ul>
                <h2>Another section</h2>
                <p>Sections sit space.40 apart. Inline links use the Link component, Inline type.</p>
                <p>For an example, read the <a dma-link href="#">accessibility statement</a>.</p>
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
