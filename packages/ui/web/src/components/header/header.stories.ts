import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular-vite';
import { HeaderComponent } from './header.component';
import { ButtonComponent } from '../button';
import { IconGithubComponent } from '../icon';
import { LogoComponent } from '../logo';
import { NavLinkComponent } from '../nav-link';

const meta = {
    title: 'Header',
    component: HeaderComponent,
    decorators: [moduleMetadata({ imports: [LogoComponent, NavLinkComponent, ButtonComponent, IconGithubComponent] })],
    render: () => ({
        template: `
            <header dma-header>
                <a href="#"><dma-logo size="small" /></a>
                <a dma-nav-link href="#" aria-current="page">Compendium</a>
                <a dma-nav-link href="#">Characters</a>
                <a dma-nav-link href="#">Campaigns</a>
                <a dma-button kind="quiet" href="#"><dma-icon-github />GitHub</a>
            </header>
        `,
    }),
} satisfies Meta<HeaderComponent>;

export default meta;

type Story = StoryObj<HeaderComponent>;

/**
 * The link home and the nav links at the start, and the GitHub button and the Theme picker at the end, from the
 * desktop breakpoint up.
 */
export const Desktop: Story = {};

/**
 * The link home at the start and the Menu button at the end, below the desktop breakpoint. The docs page shows the
 * story in an iframe narrower than the breakpoint.
 */
export const Mobile: Story = {
    globals: { viewport: { value: 'mobile1', isRotated: false } },
};
