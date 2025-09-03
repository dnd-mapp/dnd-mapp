import { Meta, StoryObj } from '@storybook/angular';
import { withActions } from 'storybook/actions/decorator';
import { TableStoryComponent } from './table-story.component';

const meta = {
    title: 'Components/Table',
    tags: ['!dev'],
    component: TableStoryComponent,
    args: {},
    decorators: [withActions],
    parameters: {
        actions: {
            // handles: [],
        },
        docs: {
            source: {
                code: `
                `,
            },
        },
    },
    argTypes: {},
} satisfies Meta<TableStoryComponent>;

export default meta;

type Story = StoryObj<TableStoryComponent>;

export const Default: Story = {
    tags: ['dev'],
    name: 'Interactive',
};
