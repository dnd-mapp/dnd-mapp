import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular-vite';
import { FooterComponent } from './footer.component';
import { LinkComponent } from '../link';
import { LinkGroupComponent } from '../link-group';

/** The columns that Penpot draws, each a heading with the labels of its links. */
const COLUMNS = [
    { heading: 'Product', links: ['Compendium', 'Dice', 'Characters', 'Campaigns'] },
    { heading: 'Project', links: ['GitHub', 'Contributing', 'Code of conduct', 'Support'] },
    { heading: 'Legal', links: ['Privacy', 'Accessibility', 'License'] },
];

const meta = {
    title: 'Footer',
    component: FooterComponent,
    decorators: [moduleMetadata({ imports: [LinkGroupComponent, LinkComponent] })],
    parameters: { layout: 'fullscreen' },
    render: () => ({
        props: { columns: COLUMNS },
        template: `
            <footer dma-footer>
                @for (column of columns; track column.heading) {
                    <nav [attr.aria-labelledby]="'footer-' + $index">
                        <dma-link-group>
                            <h2 [id]="'footer-' + $index">{{ column.heading }}</h2>
                            @for (link of column.links; track link) {
                                <li><a dma-link kind="quiet" href="#">{{ link }}</a></li>
                            }
                        </dma-link-group>
                    </nav>
                }
            </footer>
        `,
    }),
} satisfies Meta<FooterComponent>;

export default meta;

type Story = StoryObj<FooterComponent>;

/** Every part stacks in one column, as Penpot draws the Mobile variant. */
export const Mobile: Story = {
    globals: { viewport: { value: 'mobile1', isRotated: false } },
};
