import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LogoComponent } from './logo.component';
import { DEFAULT_LOGO_KIND, DEFAULT_LOGO_SIZE, LogoKind, LogoSize } from './logo.types';
import { radioArgType } from '../../../.storybook/arg-types';

const meta = {
    title: 'Logo',
    component: LogoComponent,
    argTypes: {
        kind: radioArgType({
            values: LogoKind,
            typeName: 'LogoKind',
            defaultValue: DEFAULT_LOGO_KIND,
            description: 'What the logo shows: the mark with the wordmark, or the mark alone where space is short.',
        }),
        size: radioArgType({
            values: LogoSize,
            typeName: 'LogoSize',
            defaultValue: DEFAULT_LOGO_SIZE,
            description: 'How large the logo draws: large for headers, small for menus and footers.',
        }),
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
