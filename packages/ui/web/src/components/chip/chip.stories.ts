import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ChipComponent } from './chip.component';
import { ChipKind, DEFAULT_CHIP_KIND } from './chip.types';
import { radioArgType } from '../../../.storybook/arg-types';

/** The args of a story: the inputs of the chip, and the label it projects. */
type ChipArgs = ChipComponent & { label: string };

const meta = {
    title: 'Chip',
    component: ChipComponent,
    argTypes: {
        kind: radioArgType({
            values: ChipKind,
            typeName: 'ChipKind',
            defaultValue: DEFAULT_CHIP_KIND,
            description:
                'How the chip looks: neutral, for tool names and conditions, status, for features that are not built yet, or DM, for tools meant for dungeon masters.',
        }),
        label: {
            description: 'The content the chip projects, which carries its meaning.',
            control: 'text',
        },
    },
    render: (args) => ({
        props: args,
        template: `<dma-chip [kind]="kind">{{ label }}</dma-chip>`,
    }),
} satisfies Meta<ChipArgs>;

export default meta;

type Story = StoryObj<ChipArgs>;

export const Neutral: Story = {
    args: { kind: 'neutral', label: 'Label' },
};

export const Status: Story = {
    args: { kind: 'status', label: 'Planned' },
};

export const Dm: Story = {
    args: { kind: 'dm', label: 'DM' },
};

/** Chips in a row, as Card holds them. */
export const Examples: Story = {
    render: () => ({
        template: `
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-8)">
                <dma-chip kind="status">Planned</dma-chip>
                <dma-chip kind="status">Concept</dma-chip>
                <dma-chip kind="dm">DM</dma-chip>
                <dma-chip>Poisoned</dma-chip>
                <dma-chip>Prone</dma-chip>
                <dma-chip>Spreadsheets</dma-chip>
            </div>
        `,
    }),
};
