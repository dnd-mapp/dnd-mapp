import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular-vite';
import { HeaderComponent } from './header.component';
import { LogoComponent } from '../logo';

const meta = {
    title: 'Header',
    component: HeaderComponent,
    decorators: [moduleMetadata({ imports: [LogoComponent] })],
    render: () => ({
        template: `
            <header dma-header>
                <a href="#"><dma-logo size="small" /></a>
            </header>
        `,
    }),
} satisfies Meta<HeaderComponent>;

export default meta;

type Story = StoryObj<HeaderComponent>;

/**
 * The link home at the start and the Menu button at the end, below the desktop breakpoint. The docs page shows the
 * story in an iframe narrower than the breakpoint.
 */
export const Mobile: Story = {
    globals: { viewport: { value: 'mobile1', isRotated: false } },
};
