import { Meta, StoryObj } from '@storybook/angular';
import { withActions } from 'storybook/actions/decorator';
import { CheckboxStoryComponent } from './checkbox-story.component';

const meta = {
    title: 'Components/Checkbox',
    tags: ['!dev'],
    component: CheckboxStoryComponent,
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
} satisfies Meta<CheckboxStoryComponent>;

export default meta;

type Story = StoryObj<CheckboxStoryComponent>;

export const Default: Story = {
    tags: ['dev'],
    name: 'Interactive',
};
