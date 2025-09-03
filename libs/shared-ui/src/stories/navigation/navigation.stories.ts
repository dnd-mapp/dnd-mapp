import { Meta, StoryObj } from '@storybook/angular';
import { withActions } from 'storybook/actions/decorator';
import { NavigationStoryComponent } from './navigation-story.component';

const meta = {
    title: 'Components/Navigation',
    tags: ['!dev'],
    component: NavigationStoryComponent,
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
} satisfies Meta<NavigationStoryComponent>;

export default meta;

type Story = StoryObj<NavigationStoryComponent>;

export const Default: Story = {
    tags: ['dev'],
    name: 'Interactive',
};
