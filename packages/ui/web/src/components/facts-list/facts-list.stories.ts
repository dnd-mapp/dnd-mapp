import type { Meta, StoryObj } from '@storybook/angular-vite';
import { FactsListComponent } from './facts-list.component';

const meta = {
    title: 'Facts list',
    component: FactsListComponent,
    render: () => ({
        template: `
            <div class="column">
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
            </div>
        `,
        styles: [
            `
                .column {
                    max-inline-size: 42rem;
                }
            `,
        ],
    }),
} satisfies Meta<FactsListComponent>;

export default meta;

type Story = StoryObj<FactsListComponent>;

/** Each term sits beside its value, from the desktop breakpoint up. */
export const Desktop: Story = {};

/**
 * Each term stacks above its value, below the desktop breakpoint. The docs page shows the story in an iframe narrower
 * than the breakpoint.
 */
export const Mobile: Story = {
    globals: { viewport: { value: 'mobile1', isRotated: false } },
};
