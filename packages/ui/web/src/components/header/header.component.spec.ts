import { Component } from '@angular/core';
import { page, userEvent } from 'vitest/browser';
import { HeaderComponent } from './header.component';
import { ButtonComponent } from '../button';
import { IconGithubComponent } from '../icon';
import { LogoComponent } from '../logo';
import { NavLinkComponent } from '../nav-link';
import { Theme } from '../../theme';
import {
    HeaderHarness,
    type HeaderPart,
    InMemoryStorage,
    provideBrowserStorage,
    readColorToken,
    setupTestEnvironment,
} from '@critsource/ui-web/testing';

/** The parts each layout shows, and hides from sight and from assistive technology. */
const PARTS: Record<'mobile' | 'desktop', { shown: HeaderPart[]; hidden: HeaderPart[] }> = {
    mobile: { shown: ['home', 'menu'], hidden: ['nav', 'github', 'theme'] },
    desktop: { shown: ['home', 'nav', 'github', 'theme'], hidden: ['menu'] },
};

describe('HeaderComponent', () => {
    @Component({
        template: `
            <header dma-header (menuPressed)="presses = presses + 1">
                <a href="#"><dma-logo size="small" /></a>
                <a dma-nav-link href="#" aria-current="page">Compendium</a>
                <a dma-nav-link href="#">Characters</a>
                <a dma-nav-link href="#">Campaigns</a>
                <a dma-button kind="quiet" href="#"><dma-icon-github />GitHub</a>
            </header>
        `,
        imports: [HeaderComponent, LogoComponent, NavLinkComponent, ButtonComponent, IconGithubComponent],
    })
    class TestComponent {
        public presses = 0;
    }

    async function setupTest() {
        const { fixture, harness } = await setupTestEnvironment({
            host: TestComponent,
            harness: HeaderHarness,
            providers: [provideBrowserStorage(new InMemoryStorage())],
        });

        return { host: fixture.componentInstance, harness };
    }

    afterEach(async () => {
        document.documentElement.removeAttribute('data-theme');
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

    // The width of the Mobile variant in Penpot, below the desktop breakpoint.
    describe('with the Mobile layout', () => {
        beforeEach(async () => {
            await page.viewport(375, 800);
        });

        it('should show the link home and the Menu button only', async () => {
            const { harness } = await setupTest();

            for (const part of PARTS.mobile.shown) {
                expect(await harness.isShown(part), part).toBe(true);
            }
            for (const part of PARTS.mobile.hidden) {
                expect(await harness.isShown(part), part).toBe(false);
            }
            await expect.element(page.getByRole('navigation')).not.toBeInTheDocument();
            await expect.element(page.getByRole('group', { name: 'Theme', exact: true })).not.toBeInTheDocument();
        });

        it('should fill the width of the page, 68 px tall', async () => {
            const { harness } = await setupTest();

            expect(await harness.getSize()).toEqual({ width: 375, height: 68 });
        });

        it('should put the link home 20 px from the start, and 18 px from the top and bottom', async () => {
            const { harness } = await setupTest();

            expect(await harness.getInsets('home')).toEqual(expect.objectContaining({ top: 18, bottom: 18, left: 20 }));
        });

        it('should put the Menu button 20 px from the end, 12 px from the top, and 12 px from the bottom', async () => {
            const { harness } = await setupTest();

            expect(await harness.getInsets('menu')).toEqual(
                expect.objectContaining({ top: 12, right: 20, bottom: 12 }),
            );
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

        // `pressMenu()` moves no focus, like a click in Safari, which doesn't focus a button it clicks.
        it('should focus the Menu button when the reader presses it', async () => {
            const { harness } = await setupTest();

            await harness.pressMenu();

            await expect.element(page.getByRole('button', { name: 'Menu', exact: true })).toHaveFocus();
        });

        it.each(['{Enter}', ' '])(
            'should emit menuPressed when the reader presses %s on the Menu button',
            async (key) => {
                const { host } = await setupTest();

                page.getByRole('button', { name: 'Menu', exact: true }).element().focus();
                await userEvent.keyboard(key);

                expect(host.presses).toBe(1);
            },
        );
    });

    // The width of the Desktop variant in Penpot, from the desktop breakpoint up.
    describe('with the Desktop layout', () => {
        beforeEach(async () => {
            await page.viewport(1440, 800);
        });

        it('should show the nav links, the GitHub button, and the Theme picker instead of the Menu button', async () => {
            const { harness } = await setupTest();

            for (const part of PARTS.desktop.shown) {
                expect(await harness.isShown(part), part).toBe(true);
            }
            for (const part of PARTS.desktop.hidden) {
                expect(await harness.isShown(part), part).toBe(false);
            }
            await expect.element(page.getByRole('button', { name: 'Menu', exact: true })).not.toBeInTheDocument();
        });

        it('should fill the width of the page, 68 px tall', async () => {
            const { harness } = await setupTest();

            expect(await harness.getSize()).toEqual({ width: 1440, height: 68 });
        });

        it('should put the link home 120 px from the start, and 18 px from the top and bottom', async () => {
            const { harness } = await setupTest();

            expect(await harness.getInsets('home')).toEqual(
                expect.objectContaining({ top: 18, bottom: 18, left: 120 }),
            );
        });

        it('should put the nav links 32 px after the link home, 4 px apart', async () => {
            const { harness } = await setupTest();
            const [home, nav] = await Promise.all([harness.getInsets('home'), harness.getInsets('nav')]);
            const links = await harness.getNavLinks();
            const widths = await Promise.all(links.map(async (link) => (await link.getSize()).width));

            expect(nav).toEqual(expect.objectContaining({ top: 12, bottom: 12, left: 1440 - home.right + 32 }));
            expect(1440 - nav.left - nav.right).toBe(widths.reduce((total, width) => total + width, 0) + 2 * 4);
        });

        it('should put the projected nav links in a nav named Main, in their order', async () => {
            const { harness } = await setupTest();
            const links = await harness.getNavLinks();

            await expect.element(page.getByRole('navigation', { name: 'Main', exact: true })).toBeInTheDocument();
            expect(await Promise.all(links.map(async (link) => await link.getText()))).toEqual([
                'Compendium',
                'Characters',
                'Campaigns',
            ]);
            expect(await Promise.all(links.map(async (link) => await link.isCurrent()))).toEqual([true, false, false]);
        });

        it('should put the projected GitHub button 12 px before the Theme picker', async () => {
            const { harness } = await setupTest();
            const button = await harness.getGitHubButton();
            const [github, theme] = await Promise.all([harness.getInsets('github'), harness.getInsets('theme')]);

            expect(button).not.toBeNull();
            expect((await button?.getText())?.trim()).toBe('GitHub');
            expect(github).toEqual(expect.objectContaining({ top: 12, bottom: 12 }));
            expect(github.right).toBe(theme.right + 124 + 12);
        });

        it('should put the Theme picker in its Icons display 120 px from the end, and 12 px from the top and bottom', async () => {
            const { harness } = await setupTest();
            const picker = await harness.getThemePicker();
            const options = await picker.getOptions();

            expect(await harness.getInsets('theme')).toEqual(
                expect.objectContaining({ top: 12, right: 120, bottom: 12 }),
            );
            expect(await picker.getSize()).toEqual({ width: 124, height: 44 });
            expect(await Promise.all(options.map(async (option) => await option.isLabelShown()))).toEqual([
                false,
                false,
                false,
            ]);
        });

        it('should set the theme the reader picks in the Theme picker', async () => {
            const { harness } = await setupTest();
            const label = page.getByRole('radio', { name: 'Dark', exact: true }).element().closest('label');

            if (!label) {
                throw new Error('The radio input has no label.');
            }
            await userEvent.click(page.elementLocator(label));

            expect(await (await harness.getThemePicker()).getSelected()).toBe(Theme.Dark);
            expect(document.documentElement.getAttribute('data-theme')).toBe(Theme.Dark);
        });
    });
});
