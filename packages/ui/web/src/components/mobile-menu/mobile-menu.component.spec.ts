import { Component, viewChild } from '@angular/core';
import { page } from 'vitest/browser';
import { MobileMenuComponent } from './mobile-menu.component';
import { ButtonComponent } from '../button';
import { IconGithubComponent } from '../icon';
import { LogoComponent } from '../logo';
import { NavLinkComponent } from '../nav-link';
import { MobileMenuHarness, readColorToken, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

describe('MobileMenuComponent', () => {
    @Component({
        template: `
            <dialog dma-mobile-menu (close)="closes = closes + 1">
                <a href="#"><dma-logo size="small" /></a>
                <a dma-nav-link kind="row" href="#" aria-current="page">Compendium</a>
                <a dma-nav-link kind="row" href="#">Characters</a>
                <a dma-nav-link kind="row" href="#">Campaigns</a>
                <a dma-button kind="quiet" href="#"><dma-icon-github />GitHub</a>
            </dialog>
        `,
        imports: [MobileMenuComponent, LogoComponent, NavLinkComponent, ButtonComponent, IconGithubComponent],
    })
    class TestComponent {
        public readonly menu = viewChild.required(MobileMenuComponent);
        public closes = 0;
    }

    async function setupTest() {
        const { fixture, harness } = await setupTestEnvironment({ host: TestComponent, harness: MobileMenuHarness });

        return { host: fixture.componentInstance, harness };
    }

    /** Opens the menu as a page does, through the component. */
    async function setupOpenTest() {
        const test = await setupTest();

        test.host.menu().showModal();

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

    it('should open as a modal dialog named Menu', async () => {
        const { harness } = await setupOpenTest();

        expect(await harness.isOpen()).toBe(true);
        expect(await harness.isModal()).toBe(true);
        await expect.element(page.getByRole('dialog', { name: 'Menu', exact: true })).toBeInTheDocument();
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

    it('should close, and fire the native close event, when the reader presses Close', async () => {
        const { host, harness } = await setupOpenTest();

        await harness.pressClose();

        expect(await harness.isOpen()).toBe(false);
        await expect.poll(() => host.closes).toBe(1);
    });

    it('should close when the page closes it', async () => {
        const { host, harness } = await setupOpenTest();

        host.menu().close();

        expect(await harness.isOpen()).toBe(false);
        await expect.poll(() => host.closes).toBe(1);
    });
});
