import type { Meta, StoryObj } from '@storybook/angular-vite';
import { SectionIntroComponent } from './section-intro.component';

/** The args of a story: the text of each part the section intro projects. */
type SectionIntroArgs = SectionIntroComponent & { eyebrow: string; heading: string; intro: string };

const meta = {
    title: 'Section intro',
    component: SectionIntroComponent,
    argTypes: {
        eyebrow: { description: 'The `<p>` the section intro projects before the heading.', control: 'text' },
        heading: {
            description: 'The heading the section intro projects, at the level the page needs.',
            control: 'text',
        },
        intro: { description: 'The `<p>` the section intro projects after the heading.', control: 'text' },
    },
    args: {
        eyebrow: 'Eyebrow',
        heading: 'Section heading',
        intro: 'One or two sentences that say what this section covers and why it matters to the reader.',
    },
    render: (args) => ({
        props: args,
        template: `
            <hgroup dma-section-intro>
                <p>{{ eyebrow }}</p>
                <h2>{{ heading }}</h2>
                <p>{{ intro }}</p>
            </hgroup>
        `,
    }),
} satisfies Meta<SectionIntroArgs>;

export default meta;

type Story = StoryObj<SectionIntroArgs>;

export const Start: Story = {};
