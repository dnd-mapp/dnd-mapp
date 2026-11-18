import { Component } from '@angular/core';
import { page, userEvent } from 'vitest/browser';
import { MobileMenuComponent } from './mobile-menu.component';
import { ButtonComponent } from '../button';
import { HeaderComponent } from '../header';
import { IconGithubComponent } from '../icon';
import { LogoComponent } from '../logo';
import { NavLinkComponent } from '../nav-link';
import {
    InMemoryStorage,
    MobileMenuHarness,
    provideBrowserStorage,
    readColorToken,
    setupTestEnvironment,
} from '@dnd-mapp/ui-web/testing';

describe('MobileMenuComponent', () => {
    @Component({
        template: `
            <header dma-header (menuPressed)="menu.showModal()">
                <a href="#"><dma-logo size="small" /></a>
            </header>
            <dialog dma-mobile-menu #menu (close)="closes = closes + 1">
                <a href="#"><dma-logo size="small" /></a>
                <a dma-nav-link kind="row" href="#" aria-current="page">Compendium</a>
                <a dma-nav-link kind="row" href="#">Characters</a>
                <a dma-nav-link kind="row" href="#">Campaigns</a>
                <a dma-button kind="quiet" href="#"><dma-icon-github />GitHub</a>
            </dialog>
        `,
        imports: [
            HeaderComponent,
            MobileMenuComponent,
            LogoComponent,
            NavLinkComponent,
            ButtonComponent,
            IconGithubComponent,
        ],
    })
    class TestComponent {
        public closes = 0;
    }

    async function setupTest() {
        const { fixture, harness } = await setupTestEnvironment({
            host: TestComponent,
            harness: MobileMenuHarness,
            providers: [provideBrowserStorage(new InMemoryStorage())],
        });

        return { host: fixture.componentInstance, harness };
    }

    const menuButton = () => page.getByRole('button', { name: 'Menu', exact: true });
    const closeButton = () => page.getByRole('button', { name: 'Close', exact: true });

    /**
     * Opens the menu from the Menu button of the header, as the reader does. The click comes from the browser rather
     * than the harness, so the Menu button takes focus first, as in Chromium, and the menu has a focus to return to.
     */
    async function setupOpenTest() {
        const test = await setupTest();

        await userEvent.click(menuButton());

        return test;
    }

    // The size of the Mobile menu in Penpot, below the desktop breakpoint.
    beforeEach(async () => {
        await page.viewport(375, 812);
    });

    afterEach(async () => {
        await page.viewport(innerWidth, innerHeight);
    });

    it('should stay closed, and out of the accessibility tree, until the page opens it', async () => {
        const { harness } = await setupTest();

        expect(await harness.isOpen()).toBe(false);
        await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
    });

    it('should open as a modal dialog named Menu when the reader presses the Menu button', async () => {
        const { harness } = await setupOpenTest();

        expect(await harness.isOpen()).toBe(true);
        expect(await harness.isModal()).toBe(true);
        await expect.element(page.getByRole('dialog', { name: 'Menu', exact: true })).toBeInTheDocument();
    });

    it('should move focus to the Close button when it opens', async () => {
        await setupOpenTest();

        await expect.element(closeButton()).toHaveFocus();
    });

    it('should keep focus out of the page behind, which is inert', async () => {
        await setupOpenTest();
        const header = document.querySelector('header[dma-header]');
        const dialog = document.querySelector('dialog[dma-mobile-menu]');
        const focused: (Element | null)[] = [];

        for (let step = 0; step < 6; step++) {
            await userEvent.tab();
            focused.push(document.activeElement);
        }

        expect(focused.some((element) => header?.contains(element))).toBe(false);
        expect(focused.filter((element) => dialog?.contains(element))).not.toHaveLength(0);
    });

    it('should cover the viewport with the page background', async () => {
        const { harness } = await setupOpenTest();

        expect(await harness.getBox()).toEqual({ top: 0, left: 0, width: 375, height: 812 });
        expect(await harness.getLook()).toEqual({
            background: readColorToken('--color-background-page'),
            color: readColorToken('--color-foreground-default'),
            borderWidth: '0px',
        });
    });

    it('should stop the page behind from scrolling while it is open', async () => {
        const { harness } = await setupOpenTest();

        expect(getComputedStyle(document.documentElement).overflow).toBe('hidden');

        await harness.pressClose();

        expect(getComputedStyle(document.documentElement).overflow).not.toBe('hidden');
    });

    it('should draw the bar of Header, 68 px tall with the divider along its bottom', async () => {
        const { harness } = await setupOpenTest();

        expect(await harness.getBarLook()).toEqual({
            dividerColor: readColorToken('--color-border-divider'),
            dividerWidth: '1px',
            height: 68,
        });
    });

    it('should project the link home 20 px from the start, and 18 px from the top', async () => {
        const { harness } = await setupOpenTest();

        expect(await harness.getLogo()).not.toBeNull();
        expect(await harness.getHomeTextDecoration()).toBe('none');
        expect(await harness.getBarInsets('home')).toEqual(expect.objectContaining({ top: 18, left: 20 }));
    });

    it('should draw the Close button as a quiet button with the close icon, 20 px from the end and 12 px from the top', async () => {
        const { harness } = await setupOpenTest();
        const button = await harness.getCloseButton();
        const icons = await button.getIcons();

        // The Close button opens where the click on the Menu button left the pointer, so the pointer moves to the link
        // home, which draws no hover state, before the test reads the default look.
        await userEvent.hover(page.getByRole('dialog').getByRole('link', { name: 'D&D Mapp', exact: true }));

        expect((await button.getText()).trim()).toBe('Close');
        expect(icons).toHaveLength(1);
        expect(await icons[0]?.getGlyph()).toBe('close');
        expect(await button.getLook()).toEqual({
            background: 'rgba(0, 0, 0, 0)',
            borderColor: readColorToken('--color-border-control'),
            color: readColorToken('--color-foreground-default'),
        });
        expect((await button.getSize()).height).toBe(44);
        expect(await harness.getBarInsets('close')).toEqual(expect.objectContaining({ top: 12, right: 20 }));
    });

    it('should close, and return focus to the Menu button, when the reader presses Close', async () => {
        const { host, harness } = await setupOpenTest();

        await harness.pressClose();

        expect(await harness.isOpen()).toBe(false);
        await expect.poll(() => host.closes).toBe(1);
        await expect.element(menuButton()).toHaveFocus();
    });

    it.each(['{Enter}', ' '])('should close when the reader presses %s on the Close button', async (key) => {
        const { harness } = await setupOpenTest();

        await userEvent.keyboard(key);

        expect(await harness.isOpen()).toBe(false);
        await expect.element(menuButton()).toHaveFocus();
    });

    it('should close, and return focus to the Menu button, when the reader presses Escape', async () => {
        const { host, harness } = await setupOpenTest();

        await userEvent.keyboard('{Escape}');

        expect(await harness.isOpen()).toBe(false);
        await expect.poll(() => host.closes).toBe(1);
        await expect.element(menuButton()).toHaveFocus();
    });

    it('should open again after it closes', async () => {
        const { harness } = await setupOpenTest();

        await harness.pressClose();
        await userEvent.click(menuButton());

        expect(await harness.isModal()).toBe(true);
        await expect.element(closeButton()).toHaveFocus();
    });
});
