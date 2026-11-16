import type { Meta, StoryObj } from '@storybook/angular-vite';
import { TabComponent } from './tab.component';
import { TabListComponent } from './tab-list.component';
import { TabPanelComponent } from './tab-panel.component';

const meta = {
    title: 'Tabs',
    component: TabListComponent,
    subcomponents: { TabComponent, TabPanelComponent },
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
        moduleMetadata: { imports: [TabComponent, TabPanelComponent] },
        template: `
            <dma-tab-list aria-label="Character sheet" [(selected)]="selected">
                <button dma-tab [panel]="overview">Overview</button>
                <button dma-tab [panel]="stats">Stats</button>
                <button dma-tab [panel]="spells">Spells</button>
                <button dma-tab [panel]="notes">Notes</button>
            </dma-tab-list>
            <dma-tab-panel #overview><p>The class, level, and background of the character.</p></dma-tab-panel>
            <dma-tab-panel #stats><p>The six ability scores and their modifiers.</p></dma-tab-panel>
            <dma-tab-panel #spells><p>The spells the character knows, by level.</p></dma-tab-panel>
            <dma-tab-panel #notes><p>Whatever the player wants to remember.</p></dma-tab-panel>
        `,
    }),
} satisfies Meta<TabListComponent>;

export default meta;

type Story = StoryObj<TabListComponent>;

export const Default: Story = {
    args: { selected: 0 },
};
