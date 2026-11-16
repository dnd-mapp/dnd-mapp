import { Component } from '@angular/core';
import { page, userEvent } from 'vitest/browser';
import { HeaderComponent } from './header.component';
import { LogoComponent } from '../logo';
import { HeaderHarness, readColorToken, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

describe('HeaderComponent', () => {
    @Component({
        template: `
            <header dma-header (menuPressed)="presses = presses + 1">
                <a href="#"><dma-logo size="small" /></a>
            </header>
        `,
        imports: [HeaderComponent, LogoComponent],
    })
    class TestComponent {
        public presses = 0;
    }

    async function setupTest() {
        const { fixture, harness } = await setupTestEnvironment({ host: TestComponent, harness: HeaderHarness });

        return { host: fixture.componentInstance, harness };
    }

    // The width of the Mobile variant in Penpot, below the desktop breakpoint.
    beforeEach(async () => {
        await page.viewport(375, 800);
    });

    afterEach(async () => {
        await page.viewport(innerWidth, innerHeight);
    });

    it('should project the link home, which takes its name from the logo', async () => {
        const { harness } = await setupTest();

        expect(await harness.getLogo()).not.toBeNull();
        await expect.element(page.getByRole('link', { name: 'D&D Mapp', exact: true })).toBeInTheDocument();
    });

    it('should draw no underline under the logo of the link home', async () => {
        const { harness } = await setupTest();

        expect(await harness.getHomeTextDecoration()).toBe('none');
    });

    it('should be the banner of the page', async () => {
        await setupTest();

        await expect.element(page.getByRole('banner')).toBeInTheDocument();
    });

    it('should draw the page background with the divider along its bottom', async () => {
        const { harness } = await setupTest();

        expect(await harness.getLook()).toEqual({
            background: readColorToken('--color-background-page'),
            dividerColor: readColorToken('--color-border-divider'),
            dividerWidth: '1px',
        });
    });

    it('should fill the width of the page, 68 px tall', async () => {
        const { harness } = await setupTest();

        expect(await harness.getSize()).toEqual({ width: 375, height: 68 });
    });

    it('should put the link home 20 px from the start, and 18 px from the top and bottom', async () => {
        const { harness } = await setupTest();

        expect(await harness.getInsets('home')).toEqual(expect.objectContaining({ top: 18, bottom: 18, left: 20 }));
    });

    it('should draw no focus ring on the link home until it has keyboard focus', async () => {
        const { harness } = await setupTest();

        expect((await harness.getHomeFocusRing()).style).toBe('none');
    });

    it('should draw the focus ring outside the link home when it has keyboard focus', async () => {
        const { harness } = await setupTest();

        await userEvent.tab();

        await expect.element(page.getByRole('link', { name: 'D&D Mapp', exact: true })).toHaveFocus();
        expect(await harness.getHomeFocusRing()).toEqual({
            style: 'solid',
            color: readColorToken('--color-focus-ring'),
            width: '2px',
            offset: '2px',
        });
    });

    it('should put the Menu button 20 px from the end, 12 px from the top, and 12 px from the bottom', async () => {
        const { harness } = await setupTest();

        expect(await harness.getInsets('menu')).toEqual(expect.objectContaining({ top: 12, right: 20, bottom: 12 }));
    });

    it('should draw the Menu button as a quiet button with the menu icon and its label', async () => {
        const { harness } = await setupTest();
        const button = await harness.getMenuButton();
        const icons = await button.getIcons();

        expect((await button.getText()).trim()).toBe('Menu');
        expect(icons).toHaveLength(1);
        expect(await icons[0]?.getGlyph()).toBe('menu');
        expect(await button.getLook()).toEqual({
            background: 'rgba(0, 0, 0, 0)',
            borderColor: readColorToken('--color-border-control'),
            color: readColorToken('--color-foreground-default'),
        });
        expect((await button.getSize()).height).toBe(44);
    });

    it('should tell assistive technology that the Menu button opens a dialog', async () => {
        const { harness } = await setupTest();

        await expect.element(page.getByRole('button', { name: 'Menu', exact: true })).toBeInTheDocument();
        expect(await harness.getMenuAttribute('aria-haspopup')).toBe('dialog');
        expect(await harness.getMenuAttribute('type')).toBe('button');
    });

    it('should emit menuPressed when the reader clicks the Menu button', async () => {
        const { host, harness } = await setupTest();

        await harness.pressMenu();

        expect(host.presses).toBe(1);
    });

    it.each(['{Enter}', ' '])('should emit menuPressed when the reader presses %s on the Menu button', async (key) => {
        const { host } = await setupTest();

        page.getByRole('button', { name: 'Menu', exact: true }).element().focus();
        await userEvent.keyboard(key);

        expect(host.presses).toBe(1);
    });
});
