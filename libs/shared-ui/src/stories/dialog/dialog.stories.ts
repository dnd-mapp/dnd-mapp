import { Meta, StoryObj } from '@storybook/angular';
import { withActions } from 'storybook/actions/decorator';
import { DialogStoryComponent } from './dialog-story.component';

const meta = {
    title: 'Components/Dialog',
    tags: ['!dev'],
    component: DialogStoryComponent,
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
} satisfies Meta<DialogStoryComponent>;

export default meta;

type Story = StoryObj<DialogStoryComponent>;

export const Default: Story = {
    tags: ['dev'],
    name: 'Interactive',
};
