import { BadgeTypes, DEFAULT_BADGE_TYPE } from '@dnd-mapp/shared-ui';
import { Meta, StoryObj } from '@storybook/angular';
import { BadgeStoryComponent } from './badge-story.component';

const meta = {
    title: 'Components/Badge',
    tags: ['!dev'],
    component: BadgeStoryComponent,
    args: {
        value: 0,
        type: DEFAULT_BADGE_TYPE,
    },
    argTypes: {
        type: {
            options: Object.values(BadgeTypes),
            control: 'select',
        },
    },
} satisfies Meta<BadgeStoryComponent>;

export default meta;

type Story = StoryObj<BadgeStoryComponent>;

export const Default: Story = {
    tags: ['dev'],
    name: 'Interactive',
};
