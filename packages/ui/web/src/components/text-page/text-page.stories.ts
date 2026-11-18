import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular-vite';
import { TextPageComponent } from './text-page.component';
import { LinkComponent } from '../link';
import { OnThisPageComponent, OnThisPageLinkComponent } from '../on-this-page';
import { SummaryComponent, SummaryTitleComponent } from '../summary';

/** The title block of the Text page boards of Penpot. */
const HEADER = `
    <header>
        <h1>Page title</h1>
        <p>Last updated <time datetime="2026-11-11">November 11, 2026</time></p>
    </header>
`;

/** The prose of the Text page boards of Penpot. */
const PROSE = `
    <h2 id="section-heading">Section heading</h2>
    <p>
        Paragraphs use typography.body in foreground.default, at most size.measure (720 px) wide, so lines stay easy to
        read. Keep each paragraph to one idea.
    </p>
    <p>
        A second paragraph follows the first, space.16 below it. Headings take more space above than below, so each one
        reads as part of the text that follows it.
    </p>
    <h3>Subheading</h3>
    <p>Lists hold short, parallel items:</p>
    <ul role="list">
        <li>Each item starts with a marker in foreground.muted.</li>
        <li>Items sit space.8 apart.</li>
        <li>Use a numbered list when the order matters.</li>
    </ul>
    <h2 id="another-section">Another section</h2>
    <p>Sections sit space.40 apart. Inline links use the Link component, Inline type.</p>
    <p>For an example, read the <a dma-link href="#">accessibility statement</a>.</p>
`;

/** On this page, with a link to each section of the prose. */
const NAV = `
    <nav dma-on-this-page>
        <li><a dma-on-this-page-link href="#section-heading">Section heading</a></li>
        <li><a dma-on-this-page-link href="#another-section">Another section</a></li>
    </nav>
`;

/** A Summary of the prose. */
const SUMMARY = `
    <section dma-summary>
        <h2 dma-summary-title>In short</h2>
        <ul role="list">
            <li>A Summary opens the page with a short version of it.</li>
            <li>It sits space.48 below the title block, and the prose space.48 below it.</li>
        </ul>
    </section>
`;

const meta = {
    title: 'Regions/Text page',
    component: TextPageComponent,
    decorators: [
        moduleMetadata({
            imports: [
                LinkComponent,
                OnThisPageComponent,
                OnThisPageLinkComponent,
                SummaryComponent,
                SummaryTitleComponent,
            ],
        }),
    ],
    // The article holds the text of the Text page boards of Penpot.
    render: () => ({ template: `<article dma-text-page>${HEADER}${PROSE}</article>` }),
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

/**
 * The article with On this page and a Summary, from the desktop breakpoint up. The nav takes a column of its own beside
 * the rest, and sticks while the article scrolls.
 */
export const SummaryAndOnThisPage: Story = {
    render: () => ({ template: `<article dma-text-page>${HEADER}${NAV}${SUMMARY}${PROSE}</article>` }),
};

/**
 * The article with On this page and a Summary, below the desktop breakpoint. The nav sits under the title block, in a
 * closed Disclosure, and the Summary under the nav.
 */
export const SummaryAndOnThisPageMobile: Story = {
    ...SummaryAndOnThisPage,
    globals: { viewport: { value: 'mobile1', isRotated: false } },
};
