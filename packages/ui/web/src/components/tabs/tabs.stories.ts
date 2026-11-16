import type { Meta, StoryObj } from '@storybook/angular-vite';
import { TabComponent } from './tab.component';
import { TabListComponent } from './tab-list.component';

const meta = {
    title: 'Tabs',
    component: TabListComponent,
    subcomponents: { TabComponent },
    render: () => ({
        moduleMetadata: { imports: [TabComponent] },
        template: `
            <dma-tab-list aria-label="Character sheet">
                <button dma-tab>Overview</button>
                <button dma-tab>Stats</button>
                <button dma-tab>Spells</button>
                <button dma-tab>Notes</button>
            </dma-tab-list>
        `,
    }),
} satisfies Meta<TabListComponent>;

export default meta;

type Story = StoryObj<TabListComponent>;

export const Default: Story = {};
