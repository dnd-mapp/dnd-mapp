import type { Meta, StoryObj } from '@storybook/angular-vite';
import { SummaryComponent } from './summary.component';
import { SummaryTitleComponent } from './summary-title.component';

const meta = {
    title: 'Patterns/Summary',
    component: SummaryComponent,
    render: () => ({
        moduleMetadata: { imports: [SummaryTitleComponent] },
        template: `
            <section dma-summary>
                <h2 dma-summary-title>In short</h2>
                <ul>
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
