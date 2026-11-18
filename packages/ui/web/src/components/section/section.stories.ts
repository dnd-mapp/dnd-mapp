import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular-vite';
import { SectionComponent } from './section.component';
import { DEFAULT_SECTION_BACKGROUND, SectionBackground } from './section.types';
import { SectionIntroComponent } from '../section-intro';
import { radioArgType } from '../../../.storybook/arg-types';

const meta = {
    title: 'Regions/Section',
    component: SectionComponent,
    decorators: [moduleMetadata({ imports: [SectionIntroComponent] })],
    parameters: { layout: 'fullscreen' },
    argTypes: {
        background: radioArgType({
            values: SectionBackground,
            typeName: 'SectionBackground',
            defaultValue: DEFAULT_SECTION_BACKGROUND,
            description: 'What the section fills itself with: the page background, or the surface background.',
        }),
    },
    // The dashed box stands in for the content of a section, as the Slot of Penpot does.
    render: (args) => ({
        props: args,
        template: `
            <section dma-section [background]="background" aria-labelledby="section-heading">
                <hgroup dma-section-intro>
                    <p>Eyebrow</p>
                    <h2 id="section-heading">Section heading</h2>
                    <p>One or two sentences that say what this section covers and why it matters to the reader.</p>
                </hgroup>
                <div class="slot">Section content</div>
            </section>
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
} satisfies Meta<SectionComponent>;

export default meta;

type Story = StoryObj<SectionComponent>;

/** A section on the page background, from the desktop breakpoint up. */
export const Page: Story = {
    args: { background: 'page' },
};

/** A section on the surface background, from the desktop breakpoint up. */
export const Surface: Story = {
    args: { background: 'surface' },
};

/**
 * A section on the page background, with the smaller padding and gap below the desktop breakpoint. The docs page shows
 * the story in an iframe narrower than the breakpoint.
 */
export const PageMobile: Story = {
    ...Page,
    globals: { viewport: { value: 'mobile1', isRotated: false } },
};

/** A section on the surface background, below the desktop breakpoint. */
export const SurfaceMobile: Story = {
    ...Surface,
    globals: { viewport: { value: 'mobile1', isRotated: false } },
};
