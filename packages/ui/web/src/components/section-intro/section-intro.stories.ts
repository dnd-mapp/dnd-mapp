import type { Meta, StoryObj } from '@storybook/angular-vite';
import { SectionIntroComponent } from './section-intro.component';
import { DEFAULT_SECTION_INTRO_ALIGN, SectionIntroAlign } from './section-intro.types';
import { radioArgType } from '../../../.storybook/arg-types';

/** The args of a story: the inputs of the section intro, and the text of each part it projects. */
type SectionIntroArgs = SectionIntroComponent & { eyebrow: string; heading: string; intro: string };

const meta = {
    title: 'Section intro',
    component: SectionIntroComponent,
    argTypes: {
        align: radioArgType({
            values: SectionIntroAlign,
            typeName: 'SectionIntroAlign',
            defaultValue: DEFAULT_SECTION_INTRO_ALIGN,
            description: 'How the section intro aligns its text: to the start of the line, or to its center.',
        }),
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
            <hgroup dma-section-intro [align]="align">
                <p>{{ eyebrow }}</p>
                <h2>{{ heading }}</h2>
                <p>{{ intro }}</p>
            </hgroup>
        `,
    }),
} satisfies Meta<SectionIntroArgs>;

export default meta;

type Story = StoryObj<SectionIntroArgs>;

export const Start: Story = {
    args: { align: 'start' },
};

export const Center: Story = {
    args: { align: 'center' },
};
