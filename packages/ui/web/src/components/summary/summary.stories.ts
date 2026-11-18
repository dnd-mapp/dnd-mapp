import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular-vite';
import { FactsListComponent } from '../facts-list';
import { SummaryComponent } from './summary.component';
import { SummaryTitleComponent } from './summary-title.component';

const meta = {
    title: 'Patterns/Summary',
    component: SummaryComponent,
    decorators: [moduleMetadata({ imports: [SummaryTitleComponent, FactsListComponent] })],
    render: () => ({
        template: `
            <section dma-summary>
                <h2 dma-summary-title>In short</h2>
                <ul role="list">
                    <li>No accounts, no cookies, no analytics, and no ads.</li>
                    <li>Our server logs each request, including your IP address, to keep the site running and safe.</li>
                    <li>Your theme choice stays in your browser and never reaches us.</li>
                    <li>Questions or requests about your data go to the support address.</li>
                </ul>
            </section>
        `,
    }),
} satisfies Meta<SummaryComponent>;

export default meta;

type Story = StoryObj<SummaryComponent>;

/** A title and its points, as the Privacy page opens. */
export const Points: Story = {};

/** A title and a Facts list in place of the points, as the Accessibility page opens. */
export const FactsList: Story = {
    render: () => ({
        template: `
            <section dma-summary>
                <h2 dma-summary-title>At a glance</h2>
                <dl dma-facts-list>
                    <div>
                        <dt>Standard</dt>
                        <dd>WCAG 2.2, level AA</dd>
                    </div>
                    <div>
                        <dt>Status</dt>
                        <dd>Partially conformant</dd>
                    </div>
                    <div>
                        <dt>Last checked</dt>
                        <dd>November 11, 2026</dd>
                    </div>
                    <div>
                        <dt>Method</dt>
                        <dd>Our own checks; no outside audit yet</dd>
                    </div>
                </dl>
            </section>
        `,
    }),
};

/**
 * The Facts list stacks each term above its value, below the desktop breakpoint. The docs page shows the story in an
 * iframe narrower than the breakpoint.
 */
export const FactsListMobile: Story = {
    ...FactsList,
    globals: { viewport: { value: 'mobile1', isRotated: false } },
};
