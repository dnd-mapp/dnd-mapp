import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LogoComponent } from './logo.component';

const meta = {
    title: 'Logo',
    component: LogoComponent,
    argTypes: {
        kind: { control: 'inline-radio', options: ['full', 'mark'] },
        size: { control: 'inline-radio', options: ['large', 'small'] },
    },
} satisfies Meta<LogoComponent>;

export default meta;

type Story = StoryObj<LogoComponent>;

export const FullLarge: Story = {
    args: { kind: 'full', size: 'large' },
};

export const FullSmall: Story = {
    args: { kind: 'full', size: 'small' },
};

export const MarkLarge: Story = {
    args: { kind: 'mark', size: 'large' },
};

export const MarkSmall: Story = {
    args: { kind: 'mark', size: 'small' },
};
