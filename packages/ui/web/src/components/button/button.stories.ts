import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { ButtonComponent } from './button.component';
import { ButtonKind, DEFAULT_BUTTON_KIND } from './button.types';
import { IconArrowRightComponent, IconCloseComponent, IconMenuComponent, IconPlusComponent } from '../icon';
import { radioArgType } from '../../../.storybook/arg-types';

/** The args of a story: the inputs of the button, and the label it projects. */
type ButtonArgs = ButtonComponent & { label: string };

const meta = {
    title: 'Button',
    component: ButtonComponent,
    decorators: [
        moduleMetadata({
            imports: [IconArrowRightComponent, IconCloseComponent, IconMenuComponent, IconPlusComponent],
        }),
    ],
    argTypes: {
        kind: radioArgType({
            values: ButtonKind,
            typeName: 'ButtonKind',
            defaultValue: DEFAULT_BUTTON_KIND,
            description:
                'How the button looks: primary, for the one main action of a view, secondary, for its other calls to action, or quiet, for the tools in the header and menu.',
        }),
        label: {
            description: 'The content the button projects, which names it to assistive technology.',
            control: 'text',
        },
    },
    render: (args) => ({
        props: args,
        template: `<button dma-button type="button" [kind]="kind">{{ label }}</button>`,
    }),
} satisfies Meta<ButtonArgs>;

export default meta;

type Story = StoryObj<ButtonArgs>;

const hover = { pseudo: { hover: true } };
const focus = { pseudo: { focusVisible: true } };

export const PrimaryDefault: Story = {
    args: { kind: 'primary', label: 'Label' },
};

export const PrimaryHover: Story = {
    args: { kind: 'primary', label: 'Label' },
    parameters: hover,
};

export const PrimaryFocus: Story = {
    args: { kind: 'primary', label: 'Label' },
    parameters: focus,
};

export const SecondaryDefault: Story = {
    args: { kind: 'secondary', label: 'Label' },
};

export const SecondaryHover: Story = {
    args: { kind: 'secondary', label: 'Label' },
    parameters: hover,
};

export const SecondaryFocus: Story = {
    args: { kind: 'secondary', label: 'Label' },
    parameters: focus,
};

export const QuietDefault: Story = {
    args: { kind: 'quiet', label: 'Label' },
};

export const QuietHover: Story = {
    args: { kind: 'quiet', label: 'Label' },
    parameters: hover,
};

export const QuietFocus: Story = {
    args: { kind: 'quiet', label: 'Label' },
    parameters: focus,
};

/** A button on `<a>`, which looks the same and keeps the semantics of a link. */
export const OnLink: Story = {
    args: { kind: 'primary', label: 'Label' },
    render: (args) => ({
        props: args,
        template: `<a dma-button [kind]="kind" href="#">{{ label }}</a>`,
    }),
};

/** An icon before the label, which leads it. */
export const LeadingIcon: Story = {
    args: { kind: 'primary', label: 'New map' },
    render: (args) => ({
        props: args,
        template: `<button dma-button type="button" [kind]="kind"><dma-icon-plus />{{ label }}</button>`,
    }),
};

/** An icon after the label, which trails it. */
export const TrailingIcon: Story = {
    args: { kind: 'secondary', label: 'Get started' },
    render: (args) => ({
        props: args,
        template: `<button dma-button type="button" [kind]="kind">{{ label }}<dma-icon-arrow-right /></button>`,
    }),
};

/** An icon of its own, which takes its name from `aria-label`, as the Close button of Mobile menu does. */
export const IconOnly: Story = {
    args: { kind: 'quiet' },
    render: (args) => ({
        props: args,
        template: `<button dma-button type="button" [kind]="kind" aria-label="Close"><dma-icon-close /></button>`,
    }),
};

/**
 * Buttons on a small mobile screen: in a flex row, they keep the width of their content, as in Header, while a button
 * in a block container fills it, as in Mobile menu. The docs page shows the story in an iframe narrower than the
 * desktop breakpoint, and the column keeps it at the width of a small mobile screen.
 */
export const NarrowScreen: Story = {
    args: { kind: 'secondary', label: 'Label' },
    globals: { viewport: { value: 'mobile1', isRotated: false } },
    render: (args) => ({
        props: args,
        template: `
            <div class="column">
                <div class="row">
                    <button dma-button type="button" kind="quiet" aria-label="Menu"><dma-icon-menu /></button>
                    <button dma-button type="button" kind="quiet" aria-label="Close"><dma-icon-close /></button>
                </div>
                <button dma-button type="button" [kind]="kind">{{ label }}</button>
            </div>
        `,
        styles: [
            `
                .column {
                    max-inline-size: 20rem;
                }

                .row {
                    display: flex;
                    justify-content: space-between;
                    margin-block-end: var(--space-16);
                }
            `,
        ],
    }),
};
