import { type Meta, type StoryObj } from '@storybook/angular-vite';
import { OnThisPageLinkComponent } from './on-this-page-link.component';
import { OnThisPageComponent } from './on-this-page.component';

/** The args of a story: the label the link projects, and whether it marks the section in view. */
type OnThisPageLinkArgs = OnThisPageLinkComponent & { label: string; current: boolean };

const meta = {
    title: 'Patterns/On this page',
    component: OnThisPageLinkComponent,
    subcomponents: { OnThisPageComponent },
    argTypes: {
        label: {
            description:
                'The content the link projects: the heading of its section, which names it to assistive technology.',
            control: 'text',
        },
        current: {
            description: 'Whether the link marks the section in view, through `aria-current="location"` on the link.',
            control: 'boolean',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
        },
    },
    // Each story draws the nav or its links in the 240 px column of Penpot, since they fill their container.
    render: (args) => ({
        props: args,
        template: `
            <div style="width: 240px">
                <a dma-on-this-page-link [attr.aria-current]="current ? 'location' : null" href="#section-heading">
                    {{ label }}
                </a>
            </div>
        `,
    }),
} satisfies Meta<OnThisPageLinkArgs>;

export default meta;

type Story = StoryObj<OnThisPageLinkArgs>;

export const LinkDefault: Story = {
    args: { label: 'Section heading', current: false },
};

export const LinkHover: Story = {
    args: { label: 'Section heading', current: false },
    parameters: { pseudo: { hover: true } },
};

export const LinkFocus: Story = {
    args: { label: 'Section heading', current: false },
    parameters: { pseudo: { focusVisible: true } },
};

export const LinkCurrent: Story = {
    args: { label: 'Section heading', current: true },
};

/** The links of the Privacy page stacked as On this page lists them, with the first section in view. */
export const Links: Story = {
    render: () => ({
        template: `
            <div style="width: 240px">
                <a dma-on-this-page-link aria-current="location" href="#who-is-responsible">Who is responsible</a>
                <a dma-on-this-page-link href="#what-we-process">What we process</a>
                <a dma-on-this-page-link href="#what-we-dont-do">What we don’t do</a>
                <a dma-on-this-page-link href="#who-else-sees-it">Who else sees it</a>
                <a dma-on-this-page-link href="#your-rights">Your rights</a>
                <a dma-on-this-page-link href="#changes-to-this-statement">Changes to this statement</a>
            </div>
        `,
    }),
};

/**
 * On this page on Desktop, as Penpot draws it, with the first section in view, from the desktop breakpoint up. The page
 * has no headings for its links, so the nav leaves the marked link as it is.
 */
export const Desktop: Story = {
    render: () => ({
        moduleMetadata: { imports: [OnThisPageComponent] },
        template: `
            <nav dma-on-this-page style="width: 240px">
                <li><a dma-on-this-page-link aria-current="location" href="#who-is-responsible">Who is responsible</a></li>
                <li><a dma-on-this-page-link href="#what-we-process">What we process</a></li>
                <li><a dma-on-this-page-link href="#what-we-dont-do">What we don’t do</a></li>
                <li><a dma-on-this-page-link href="#who-else-sees-it">Who else sees it</a></li>
                <li><a dma-on-this-page-link href="#your-rights">Your rights</a></li>
                <li><a dma-on-this-page-link href="#changes-to-this-statement">Changes to this statement</a></li>
            </nav>
        `,
    }),
};

/**
 * On this page on Mobile, as Penpot draws it: a closed Disclosure that fills the width of the page, below the desktop
 * breakpoint. The docs page shows the story in an iframe narrower than the breakpoint.
 */
export const MobileClosed: Story = {
    render: () => ({
        moduleMetadata: { imports: [OnThisPageComponent] },
        template: `
            <nav dma-on-this-page>
                <li><a dma-on-this-page-link aria-current="location" href="#who-is-responsible">Who is responsible</a></li>
                <li><a dma-on-this-page-link href="#what-we-process">What we process</a></li>
                <li><a dma-on-this-page-link href="#what-we-dont-do">What we don’t do</a></li>
                <li><a dma-on-this-page-link href="#who-else-sees-it">Who else sees it</a></li>
                <li><a dma-on-this-page-link href="#your-rights">Your rights</a></li>
                <li><a dma-on-this-page-link href="#changes-to-this-statement">Changes to this statement</a></li>
            </nav>
        `,
    }),
    globals: { viewport: { value: 'mobile1', isRotated: false } },
};

/** On this page on Mobile with its panel open, as the reader opens it with a click on the summary. */
export const MobileOpen: Story = {
    ...MobileClosed,
    play: ({ canvasElement }) => {
        canvasElement.querySelector<HTMLElement>('nav[dma-on-this-page] summary')?.click();
    },
};

/** The sections of the article of the Article story, in their order. */
const SECTIONS = [
    { id: 'article-who-is-responsible', heading: 'Who is responsible' },
    { id: 'article-what-we-process', heading: 'What we process' },
    { id: 'article-what-we-dont-do', heading: 'What we don’t do' },
    { id: 'article-who-else-sees-it', heading: 'Who else sees it' },
    { id: 'article-your-rights', heading: 'Your rights' },
    { id: 'article-changes-to-this-statement', heading: 'Changes to this statement' },
];

/**
 * On this page beside a long article on Desktop, as the Privacy page places it. As the article scrolls, the nav sticks
 * and marks the section whose heading has reached the top third of the viewport.
 */
export const Article: Story = {
    render: () => ({
        moduleMetadata: { imports: [OnThisPageComponent] },
        props: { sections: SECTIONS, paragraphs: [1, 2, 3, 4] },
        template: `
            <div style="display: grid; grid-template-columns: 240px minmax(0, 60ch); gap: var(--space-48)">
                <nav dma-on-this-page>
                    @for (section of sections; track section.id) {
                        <li><a dma-on-this-page-link [href]="'#' + section.id">{{ section.heading }}</a></li>
                    }
                </nav>
                <article>
                    @for (section of sections; track section.id) {
                        <h2 [id]="section.id">{{ section.heading }}</h2>
                        @for (paragraph of paragraphs; track paragraph) {
                            <p>
                                A paragraph of {{ section.heading }}. The article runs long enough that the page scrolls
                                past each of its sections, so the mark in the nav follows the reader down the page.
                            </p>
                        }
                    }
                </article>
            </div>
        `,
    }),
};
