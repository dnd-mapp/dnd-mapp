import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular-vite';
import { MobileMenuComponent } from './mobile-menu.component';
import { ButtonComponent } from '../button';
import { HeaderComponent } from '../header';
import { IconGithubComponent } from '../icon';
import { LogoComponent } from '../logo';
import { NavLinkComponent } from '../nav-link';

/** The content of the menu, as the page projects it. */
const content = `
    <a href="#"><dma-logo size="small" /></a>
    <a dma-nav-link kind="row" href="#" aria-current="page">Compendium</a>
    <a dma-nav-link kind="row" href="#">Characters</a>
    <a dma-nav-link kind="row" href="#">Campaigns</a>
    <a dma-button kind="quiet" href="#"><dma-icon-github />GitHub</a>
`;

const meta = {
    title: 'Regions/Mobile menu',
    component: MobileMenuComponent,
    decorators: [
        moduleMetadata({
            imports: [HeaderComponent, LogoComponent, NavLinkComponent, ButtonComponent, IconGithubComponent],
        }),
    ],
    parameters: { layout: 'fullscreen' },
    // The menu shows below the desktop breakpoint only, at the size of the Mobile menu in Penpot.
    globals: { viewport: { value: 'mobile1', isRotated: false } },
} satisfies Meta<MobileMenuComponent>;

export default meta;

type Story = StoryObj<MobileMenuComponent>;

/**
 * The menu open over the page, as the Menu button of Header leaves it. The docs page shows the story in an iframe, so
 * the modal covers the story rather than the docs page.
 */
export const Open: Story = {
    render: () => ({ template: `<dialog dma-mobile-menu>${content}</dialog>` }),
    play: ({ canvasElement }) => {
        canvasElement.querySelector<HTMLDialogElement>('dialog[dma-mobile-menu]')?.showModal();
    },
};

/** The closed menu below Header. Press Menu to open it, and Close or Escape to close it again. */
export const WithHeader: Story = {
    render: () => ({
        template: `
            <header dma-header (menuPressed)="mobileMenu.showModal()">
                <a href="#"><dma-logo size="small" /></a>
            </header>
            <dialog dma-mobile-menu #mobileMenu>${content}</dialog>
        `,
    }),
};
