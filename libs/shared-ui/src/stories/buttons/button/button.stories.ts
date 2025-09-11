import {
    ButtonShapes,
    ButtonSizes,
    ButtonTypes,
    DEFAULT_BUTTON_SHAPE,
    DEFAULT_BUTTON_SIZE,
    DEFAULT_BUTTON_TYPE,
} from '@dnd-mapp/shared-ui';
import { Meta, StoryObj } from '@storybook/angular';
import { ButtonStoryComponent } from './button-story.component';

const meta = {
    title: 'Components/Buttons/Button',
    tags: ['!dev'],
    component: ButtonStoryComponent,
    args: {
        type: DEFAULT_BUTTON_TYPE,
        size: DEFAULT_BUTTON_SIZE,
        shape: DEFAULT_BUTTON_SHAPE,
        toggle: false,
        selected: false,
        label: 'My Button label',
        withIcon: false,
    },
    argTypes: {
        type: {
            options: Object.values(ButtonTypes),
            control: 'select',
        },
        size: {
            options: Object.values(ButtonSizes),
            control: 'select',
        },
        shape: {
            options: Object.values(ButtonShapes),
            control: 'select',
        toggle: {
            table: {
                defaultValue: {
                    summary: 'false',
                },
            },
        },
        selected: {
            table: {
                defaultValue: {
                    summary: 'false',
                },
            },
        },
    },
} satisfies Meta<ButtonStoryComponent>;

export default meta;

type Story = StoryObj<ButtonStoryComponent>;

export const Default: Story = {
    tags: ['dev'],
    name: 'Interactive',
};
