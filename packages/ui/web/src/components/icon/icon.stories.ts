import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import {
    IconArrowDownComponent,
    IconArrowRightComponent,
    IconCheckComponent,
    IconCloseComponent,
    IconExternalComponent,
    IconGithubComponent,
    IconMenuComponent,
    IconMinusComponent,
    IconMonitorComponent,
    IconMoonComponent,
    IconPlusComponent,
    IconSunComponent,
} from '.';

const meta = {
    title: 'Icon',
    decorators: [
        moduleMetadata({
            imports: [
                IconMenuComponent,
                IconCloseComponent,
                IconArrowRightComponent,
                IconArrowDownComponent,
                IconPlusComponent,
                IconMinusComponent,
                IconExternalComponent,
                IconSunComponent,
                IconMoonComponent,
                IconMonitorComponent,
                IconCheckComponent,
                IconGithubComponent,
            ],
        }),
    ],
} satisfies Meta;

export default meta;

type Story = StoryObj;

// The glyphs follow the order of the variants of the Icon component in Penpot, so the two compare side by side.
const GLYPHS = [
    'menu',
    'close',
    'arrow-right',
    'arrow-down',
    'plus',
    'minus',
    'external',
    'sun',
    'moon',
    'monitor',
    'check',
    'github',
];

export const AllGlyphs: Story = {
    render: () => ({
        template: `
            <ul style="display: grid; grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr)); gap: var(--space-24); margin: 0; padding: 0; list-style: none; color: var(--color-foreground-default); font-family: var(--typography-caption-font-family); font-size: var(--typography-caption-font-size); line-height: var(--typography-caption-line-height);">
                ${GLYPHS.map(
                    (glyph) => `
                <li style="display: flex; flex-direction: column; align-items: center; gap: var(--space-8);">
                    <dma-icon-${glyph} />
                    <code>${glyph}</code>
                </li>`,
                ).join('')}
            </ul>
        `,
    }),
};

export const InheritedColor: Story = {
    render: () => ({
        template: `
            <p style="display: flex; align-items: center; gap: var(--space-8); margin: 0; color: var(--color-foreground-muted); font-family: var(--typography-body-font-family); font-size: var(--typography-body-font-size); line-height: var(--typography-body-line-height);">
                <dma-icon-github />
                Muted text, and an icon in the same color
            </p>
        `,
    }),
};
