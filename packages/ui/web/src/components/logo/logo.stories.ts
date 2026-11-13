import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LogoComponent } from './logo.component';
import { DEFAULT_LOGO_KIND, DEFAULT_LOGO_SIZE, LogoKind, LogoSize } from './logo.types';

/** Prints the values of a constant object as a union of string literals, as the table shows the type of an input. */
function unionOf(values: Record<string, string>): string {
    return Object.values(values)
        .map((value) => `'${value}'`)
        .join(' | ');
}

const meta = {
    title: 'Logo',
    component: LogoComponent,
    // Storybook reads no descriptions from the component without Compodoc, so the table takes them from here.
    argTypes: {
        kind: {
            description: 'What the logo shows: the mark with the wordmark, or the mark alone where space is short.',
            control: 'inline-radio',
            options: Object.values(LogoKind),
            table: {
                type: { summary: 'LogoKind', detail: unionOf(LogoKind) },
                defaultValue: { summary: `'${DEFAULT_LOGO_KIND}'` },
            },
        },
        size: {
            description: 'How large the logo draws: large for headers, small for menus and footers.',
            control: 'inline-radio',
            options: Object.values(LogoSize),
            table: {
                type: { summary: 'LogoSize', detail: unionOf(LogoSize) },
                defaultValue: { summary: `'${DEFAULT_LOGO_SIZE}'` },
            },
        },
    },
} satisfies Meta<LogoComponent>;

export default meta;

type Story = StoryObj<LogoComponent>;

// The args spell out the values rather than reading LogoKind and LogoSize: the code snippet of a story follows only
// constants of this file, so it would print the imported constants into a template that cannot resolve them. The
// type of the args still catches a value outside the set.

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
