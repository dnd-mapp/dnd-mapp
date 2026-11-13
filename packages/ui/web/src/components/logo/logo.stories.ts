import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LogoComponent } from './logo.component';
import { LogoKind, LogoSize } from './logo.types';

const meta = {
    title: 'Logo',
    component: LogoComponent,
    argTypes: {
        kind: { control: 'inline-radio', options: Object.values(LogoKind) },
        size: { control: 'inline-radio', options: Object.values(LogoSize) },
    },
    // Lists the inputs only, and leaves out the constants that the template reads through members of the component.
    parameters: { controls: { include: ['kind', 'size'] } },
} satisfies Meta<LogoComponent>;

export default meta;

type Story = StoryObj<LogoComponent>;

export const FullLarge: Story = {
    args: { kind: LogoKind.Full, size: LogoSize.Large },
};

export const FullSmall: Story = {
    args: { kind: LogoKind.Full, size: LogoSize.Small },
};

export const MarkLarge: Story = {
    args: { kind: LogoKind.Mark, size: LogoSize.Large },
};

export const MarkSmall: Story = {
    args: { kind: LogoKind.Mark, size: LogoSize.Small },
};
