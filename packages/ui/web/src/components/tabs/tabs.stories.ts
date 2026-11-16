import { componentWrapperDecorator, type Meta, type StoryObj } from '@storybook/angular-vite';
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
    // Hides the selected tab and the select method, which the tabs read, and the key handler from the table of args.
    parameters: { controls: { exclude: ['selectedTab', 'select', 'move'] } },
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

/** Tabs too wide for their container: the tab list scrolls sideways, and a key scrolls the tab it reaches into view. */
export const Overflow: Story = {
    args: { selected: 0 },
    decorators: [componentWrapperDecorator((story) => `<div style="max-width: 240px">${story}</div>`)],
};

/** The pointer over Stats: the tab fills its box, and its label turns to the default color. */
export const Hover: Story = {
    args: { selected: 0 },
    parameters: { pseudo: { hover: ['button[dma-tab]:nth-child(2)'] } },
};

/** Keyboard focus on the selected tab: the focus ring outside the tab, which keeps its selected look. */
export const Focus: Story = {
    args: { selected: 0 },
    parameters: { pseudo: { focusVisible: ['button[dma-tab]:nth-child(1)'] } },
};
