import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular-vite';
import { LinkGroupComponent } from './link-group.component';
import { LinkComponent } from '../link';

/** The args of a story: the heading the link group projects, and the label of each link it lists. */
type LinkGroupArgs = LinkGroupComponent & { heading: string; links: string[] };

const meta = {
    title: 'Patterns/Link group',
    component: LinkGroupComponent,
    decorators: [moduleMetadata({ imports: [LinkComponent] })],
    argTypes: {
        heading: {
            description: 'The heading the link group projects, at the level the page needs.',
            control: 'text',
        },
        links: {
            description: 'The labels of the quiet links the link group projects, one `<li>` each.',
            control: 'object',
        },
    },
    render: (args) => ({
        props: args,
        template: `
            <dma-link-group>
                <h2>{{ heading }}</h2>
                @for (link of links; track $index) {
                    <li><a dma-link kind="quiet" href="#">{{ link }}</a></li>
                }
            </dma-link-group>
        `,
    }),
} satisfies Meta<LinkGroupArgs>;

export default meta;

type Story = StoryObj<LinkGroupArgs>;

/** The link group as Penpot draws it, with the same placeholder text. */
export const Default: Story = {
    args: { heading: 'Group title', links: ['Link 1', 'Link 2', 'Link 3', 'Link 4'] },
};
