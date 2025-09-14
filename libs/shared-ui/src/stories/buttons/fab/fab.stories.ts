import { DEFAULT_FAB_COLOR, DEFAULT_FAB_SIZE, FabColors, FabSizes } from '@dnd-mapp/shared-ui';
import { Meta, StoryObj } from '@storybook/angular';
import { FabStoryComponent } from './fab-story.component';

const meta = {
    title: 'Components/Buttons/Fab',
    tags: ['!dev'],
    component: FabStoryComponent,
    args: {
        color: DEFAULT_FAB_COLOR,
        size: DEFAULT_FAB_SIZE,
        floating: false,
        navigationBarShown: false,
    },
    argTypes: {
        color: {
            options: Object.values(FabColors),
            control: {
                type: 'select',
                labels: {
                    [FabColors.TONAL_PRIMARY]: 'Tonal primary',
                    [FabColors.TONAL_SECONDARY]: 'Tonal Secondary',
                    [FabColors.TONAL_TERTIARY]: 'Tonal Tertiary',
                    [FabColors.PRIMARY]: 'Primary',
                    [FabColors.SECONDARY]: 'Secondary',
                    [FabColors.TERTIARY]: 'Tertiary',
                },
            },
            table: {
                defaultValue: {
                    summary: DEFAULT_FAB_COLOR,
                },
            },
        },
        size: {
            options: Object.values(FabSizes),
            control: {
                type: 'select',
                labels: {
                    [FabSizes.BASE]: 'Base',
                    [FabSizes.MEDIUM]: 'Medium',
                    [FabSizes.LARGE]: 'Large',
                },
            },
            table: {
                defaultValue: {
                    summary: DEFAULT_FAB_SIZE,
                },
            },
        },
        floating: {
            table: {
                defaultValue: {
                    summary: 'false',
                },
            },
        },
        navigationBarShown: {
            if: { arg: 'floating', truthy: true },
            table: {
                defaultValue: {
                    summary: 'false',
                },
            },
        },
    },
} satisfies Meta<FabStoryComponent>;

export default meta;

type Story = StoryObj<FabStoryComponent>;

export const Default: Story = {
    tags: ['dev'],
    name: 'Interactive',
};
