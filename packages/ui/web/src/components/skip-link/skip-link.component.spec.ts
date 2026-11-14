import { Component } from '@angular/core';
import { page, userEvent } from 'vitest/browser';
import { SkipLinkComponent } from './skip-link.component';
import { setupTestEnvironment, SkipLinkHarness } from '@dnd-mapp/ui-web/testing';

// Colors that no theme uses, so the skip link can only take each one from the token the test sets it on.
const ACCENT_DEFAULT = 'rgb(200, 30, 40)';
const FOREGROUND_ON_ACCENT = 'rgb(250, 250, 240)';
const FOCUS_RING = 'rgb(0, 100, 250)';

/**
 * Sets the semantic tokens that the skip link reads to values of the test, rather than loading `tokens.css`, so each
 * expectation names the token it comes from.
 */
const TOKENS = `
    .tokens {
        --color-accent-default: ${ACCENT_DEFAULT};
        --color-foreground-on-accent: ${FOREGROUND_ON_ACCENT};
        --color-focus-ring: ${FOCUS_RING};
        --border-width-focus: 2px;
        --focus-offset: 2px;
        --radius-md: 10px;
        --size-target-min: 44px;
        --space-16: 16px;
        --typography-button-font-weight: 600;
        --typography-button-line-height: 1.2;
    }
`;

describe('SkipLinkComponent', () => {
    @Component({
        template: `
            <div class="tokens">
                <a dma-skip-link href="#main">Skip to main content</a>
                <button type="button">Menu</button>
                <main id="main"><h1>Main content</h1></main>
            </div>
        `,
        styles: TOKENS,
        imports: [SkipLinkComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({ host: TestComponent, harness: SkipLinkHarness });

        return { harness, link: page.getByRole('link', { name: 'Skip to main content', exact: true }) };
    }

    it('should be a link named by its label while hidden', async () => {
        const { harness, link } = await setupTest();

        await expect.element(link).toBeInTheDocument();
        expect(await harness.getText()).toBe('Skip to main content');
    });

    it('should stay hidden until it has focus', async () => {
        const { harness, link } = await setupTest();

        await expect.element(link).not.toHaveFocus();
        expect(await harness.isShown()).toBe(false);
    });

    it('should be the first item to take keyboard focus', async () => {
        const { link } = await setupTest();

        await userEvent.tab();

        await expect.element(link).toHaveFocus();
    });

    it('should show on keyboard focus, pinned to the top left of the viewport', async () => {
        const { harness } = await setupTest();

        await userEvent.tab();

        expect(await harness.isShown()).toBe(true);
        expect(await harness.getBox()).toEqual({
            top: 16,
            left: 16,
            height: 44,
            paddingLeft: '16px',
            paddingRight: '16px',
            borderRadius: '10px',
        });
    });

    it('should draw the colors of the primary button on focus', async () => {
        const { harness } = await setupTest();

        await userEvent.tab();

        expect(await harness.getLook()).toEqual({
            background: ACCENT_DEFAULT,
            color: FOREGROUND_ON_ACCENT,
            fontWeight: '600',
        });
    });

    it('should draw the focus ring outside itself on focus', async () => {
        const { harness } = await setupTest();

        expect((await harness.getFocusRing()).style).toBe('none');

        await userEvent.tab();

        expect(await harness.getFocusRing()).toEqual({
            style: 'solid',
            color: FOCUS_RING,
            width: '2px',
            offset: '2px',
        });
    });

    it('should hide again on blur', async () => {
        const { harness, link } = await setupTest();

        await userEvent.tab();
        await userEvent.tab();

        await expect.element(link).not.toHaveFocus();
        expect(await harness.isShown()).toBe(false);
    });
});
