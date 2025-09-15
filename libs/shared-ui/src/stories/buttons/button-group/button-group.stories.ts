import { ButtonSizes, DEFAULT_BUTTON_SIZE } from '@dnd-mapp/shared-ui';
import { Meta, StoryObj } from '@storybook/angular';
import { ButtonGroupStoryComponent } from './button-group-story.component';

const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
    { value: '4', label: 'Option 4' },
];

const meta = {
    title: 'Components/Buttons/Button group',
    tags: ['!dev'],
    component: ButtonGroupStoryComponent,
    args: {
        size: DEFAULT_BUTTON_SIZE,
        options: options,
    },
    argTypes: {
        size: {
            options: Object.values(ButtonSizes),
            control: {
                type: 'select',
                labels: {
                    [ButtonSizes.EXTRA_SMALL]: 'Extra small',
                    [ButtonSizes.SMALL]: 'Small',
                    [ButtonSizes.MEDIUM]: 'Medium',
                    [ButtonSizes.LARGE]: 'Large',
                    [ButtonSizes.EXTRA_LARGE]: 'Extra large',
                },
            },
            table: {
                defaultValue: {
                    summary: DEFAULT_BUTTON_SIZE,
                },
            },
        },
    },
} satisfies Meta<ButtonGroupStoryComponent>;

export default meta;

type Story = StoryObj<ButtonGroupStoryComponent>;

export const Default: Story = {
    tags: ['dev'],
    name: 'Interactive',
};
