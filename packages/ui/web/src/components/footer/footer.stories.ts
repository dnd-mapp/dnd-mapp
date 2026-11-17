import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular-vite';
import { FooterComponent } from './footer.component';
import { withSelectedTheme } from '../../../.storybook/theme';
import { Theme } from '../../theme';
import { LinkComponent } from '../link';
import { LinkGroupComponent } from '../link-group';

const meta = {
    title: 'Regions/Footer',
    component: FooterComponent,
    decorators: [moduleMetadata({ imports: [LinkGroupComponent, LinkComponent] }), withSelectedTheme(Theme.System)],
    parameters: { layout: 'fullscreen' },
    // The columns are written out, not looped over, so the snippet of each story shows the markup a page writes.
    render: () => ({
        template: `
            <footer dma-footer>
                <nav aria-labelledby="footer-product">
                    <dma-link-group>
                        <h2 id="footer-product">Product</h2>
                        <li><a dma-link kind="quiet" href="#">Compendium</a></li>
                        <li><a dma-link kind="quiet" href="#">Dice</a></li>
                        <li><a dma-link kind="quiet" href="#">Characters</a></li>
                        <li><a dma-link kind="quiet" href="#">Campaigns</a></li>
                    </dma-link-group>
                </nav>
                <nav aria-labelledby="footer-project">
                    <dma-link-group>
                        <h2 id="footer-project">Project</h2>
                        <li><a dma-link kind="quiet" href="#">GitHub</a></li>
                        <li><a dma-link kind="quiet" href="#">Contributing</a></li>
                        <li><a dma-link kind="quiet" href="#">Code of conduct</a></li>
                        <li><a dma-link kind="quiet" href="#">Support</a></li>
                    </dma-link-group>
                </nav>
                <nav aria-labelledby="footer-legal">
                    <dma-link-group>
                        <h2 id="footer-legal">Legal</h2>
                        <li><a dma-link kind="quiet" href="#">Privacy</a></li>
                        <li><a dma-link kind="quiet" href="#">Accessibility</a></li>
                        <li><a dma-link kind="quiet" href="#">License</a></li>
                    </dma-link-group>
                </nav>
            </footer>
        `,
    }),
} satisfies Meta<FooterComponent>;

export default meta;

type Story = StoryObj<FooterComponent>;

/** The brand beside the columns, and the legal text beside the Theme picker, from the desktop breakpoint up. */
export const Desktop: Story = {};

/**
 * Every part stacks in one column, below the desktop breakpoint. The docs page shows the story in an iframe narrower
 * than the breakpoint.
 */
export const Mobile: Story = {
    globals: { viewport: { value: 'mobile1', isRotated: false } },
};
