import { Meta, StoryObj } from '@storybook/angular';
import { withActions } from 'storybook/actions/decorator';
import { SideBarStoryComponent } from './side-bar-story.component';

const meta = {
    title: 'Components/Side bar',
    tags: ['!dev'],
    component: SideBarStoryComponent,
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
} satisfies Meta<SideBarStoryComponent>;

export default meta;

type Story = StoryObj<SideBarStoryComponent>;

export const Default: Story = {
    tags: ['dev'],
    name: 'Interactive',
};
