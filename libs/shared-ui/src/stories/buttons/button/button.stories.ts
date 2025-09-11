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
            control: {
                type: 'select',
                labels: {
                    [ButtonTypes.ELEVATED]: 'Elevated',
                    [ButtonTypes.FILLED]: 'Filled',
                    [ButtonTypes.TONAL]: 'Tonal',
                    [ButtonTypes.OUTLINED]: 'Outlined',
                    [ButtonTypes.TEXT]: 'Text',
                },
            },
            table: {
                defaultValue: {
                    summary: DEFAULT_BUTTON_TYPE,
                },
            },
        },
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
        shape: {
            options: Object.values(ButtonShapes),
            control: {
                type: 'select',
                labels: {
                    [ButtonShapes.ROUND]: 'Round',
                    [ButtonShapes.SQUARE]: 'Square',
                },
            },
            table: {
                defaultValue: {
                    summary: DEFAULT_BUTTON_SHAPE,
                },
            },
        },
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
