import { ButtonComponent, ButtonTypes } from '@dnd-mapp/shared-ui';
import { Meta, StoryObj } from '@storybook/angular';

const meta = {
    title: 'Components/Button',
    tags: ['!dev'],
    component: ButtonComponent,
    args: {
        label: 'My Button',
        dmaButton: ButtonTypes.SECONDARY,
        disabled: false,
        processing: false,
    },
    render: (args) => {
        const { label, ...props } = args;

        return {
            props: props,
            template: `
                <button
                    type="button"
                    [dma-button]="this['dmaButton']"
                    [disabled]="this['disabled']"
                    [processing]="this['processing']"
                >
                    ${label}
                </button>
            `,
        };
    },
    argTypes: {
        label: {
            name: 'label',
            control: {
                type: 'text',
            },
            table: {
                category: 'Provided as content',
            },
        },
        dmaButton: {
            name: 'dma-button',
            control: {
                type: 'select',
                labels: {
                    [ButtonTypes.PRIMARY]: 'Primary',
                    [ButtonTypes.SECONDARY]: 'Secondary',
                    [ButtonTypes.DANGER]: 'Dangerous',
                },
            },
            description:
                "Adjusts the visual appearance of the button to indicate whether the action is the primary or secondary action on a page, or when it's a dangerous action.",
            options: Object.values(ButtonTypes),
            type: {
                name: 'enum',
                value: Object.values(ButtonTypes),
            },
            table: {
                category: 'Component input',
                defaultValue: {
                    summary: ButtonTypes.SECONDARY,
                    detail: `${Object.values(ButtonTypes).join(' | ')}`,
                },
            },
        },
        disabled: {
            control: 'boolean',
            description: 'Determines whether the button can be clicked.',
            type: 'boolean',
            table: {
                category: 'Component input',
                defaultValue: {
                    summary: 'false',
                },
            },
        },
        processing: {
            control: 'boolean',
            description:
                'Determines whether the action handler is still processing. The content of the button will be replaced by a spinner until the handler has resolved.',
            type: 'boolean',
            table: {
                category: 'Component input',
                defaultValue: {
                    summary: 'false',
                },
            },
        },
    },
} satisfies Meta<ButtonComponent & { label: string }>;

export default meta;

type Story = StoryObj<ButtonComponent>;

export const Default: Story = {
    tags: ['dev'],
    name: 'Interactive',
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export const Processing: Story = {
    args: {
        processing: true,
    },
};

export const Primary: Story = {
    args: {
        dmaButton: 'primary',
    },
};

export const Dangerous: Story = {
    args: {
        dmaButton: 'danger',
    },
};

export const WithLeadingIcon: Story = {
    render: (args) => ({
        props: args,
        template: `<button type="button" dma-button>
                        <dma-icon dma-pen-to-square-icon ngProjectAs="dma-leading-button-icon" />
                        My Label
                    </button>`,
    }),
};
