import type { Meta, StoryObj } from '@storybook/angular-vite';
import { TabComponent } from './tab.component';
import { TabListComponent } from './tab-list.component';

const meta = {
    title: 'Tabs',
    component: TabListComponent,
    subcomponents: { TabComponent },
    argTypes: {
        selected: {
            description:
                'The index of the selected tab, which a click changes. An index without a tab selects the first.',
            control: { type: 'number', min: 0, step: 1 },
            table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
        },
    },
    // Hides the selected tab and the select method, which the tabs read, from the table of args.
    parameters: { controls: { exclude: ['selectedTab', 'select'] } },
    render: (args) => ({
        props: args,
        moduleMetadata: { imports: [TabComponent] },
        template: `
            <dma-tab-list aria-label="Character sheet" [(selected)]="selected">
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

export const Default: Story = {
    args: { selected: 0 },
};
