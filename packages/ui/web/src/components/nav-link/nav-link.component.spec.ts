import { Component, type Type } from '@angular/core';
import { page, userEvent } from 'vitest/browser';
import { NavLinkComponent } from './nav-link.component';
import { NavLinkKind } from './nav-link.types';
import { NavLinkHarness, type NavLinkLook, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

// Colors that no theme uses, so the nav link can only take each one from the token the test sets it on.
const BACKGROUND_HOVER = 'rgb(30, 40, 50)';
const FOREGROUND_DEFAULT = 'rgb(20, 120, 40)';
const FOREGROUND_MUTED = 'rgb(90, 90, 200)';
const FOCUS_RING = 'rgb(0, 100, 250)';
const TRANSPARENT = 'rgba(0, 0, 0, 0)';

/**
 * Sets the semantic tokens that the nav link reads to values of the test, rather than loading `tokens.css`, so each
 * expectation names the token it comes from.
 */
const TOKENS = `
    .tokens {
        --color-background-hover: ${BACKGROUND_HOVER};
        --color-foreground-default: ${FOREGROUND_DEFAULT};
        --color-foreground-muted: ${FOREGROUND_MUTED};
        --color-focus-ring: ${FOCUS_RING};
        --border-width-focus: 2px;
        --focus-offset: 2px;
        --radius-md: 10px;
        --size-target-min: 44px;
        --space-12: 12px;
        --typography-nav-font-size: 15px;
        --typography-nav-font-weight: 600;
        --typography-nav-line-height: 1.2;
        --typography-nav-text-decoration: none;
        padding: 1rem;
    }
`;

/** How the bar kind looks in each state, as Penpot draws it. Focus keeps the default look. */
const LOOKS: Record<'default' | 'hover', NavLinkLook> = {
    default: { background: TRANSPARENT, color: FOREGROUND_MUTED, fontWeight: '600' },
    hover: { background: BACKGROUND_HOVER, color: FOREGROUND_DEFAULT, fontWeight: '600' },
};

describe('NavLinkComponent', () => {
    @Component({
        template: `<div class="tokens"><a dma-nav-link href="#features">Features</a></div>`,
        styles: TOKENS,
        imports: [NavLinkComponent],
    })
    class TestComponent {}

    @Component({
        template: `<div class="tokens"><a dma-nav-link [kind]="kind" href="#features">Features</a></div>`,
        styles: TOKENS,
        imports: [NavLinkComponent],
    })
    class UnknownKindTestComponent {
        public readonly kind = 'unknown' as NavLinkKind;
    }

    async function setupTest(host: Type<unknown> = TestComponent) {
        const { harness } = await setupTestEnvironment({ host, harness: NavLinkHarness });

        return { harness, link: page.getByRole('link', { name: 'Features', exact: true }) };
    }

    it('should be a link named by its label alone', async () => {
        const { harness, link } = await setupTest();

        await expect.element(link).toBeInTheDocument();
        expect(await harness.getText()).toBe('Features');
    });

    it('should draw its default look', async () => {
        const { harness } = await setupTest();

        expect(await harness.getLook()).toEqual(LOOKS.default);
    });

    it('should draw its hover look', async () => {
        const { harness, link } = await setupTest();

        await userEvent.hover(link);
        const look = await harness.getLook();
        await userEvent.unhover(link);

        expect(look).toEqual(LOOKS.hover);
    });

    it('should be as tall as the minimum target size, with padding at each side and rounded corners', async () => {
        const { harness } = await setupTest();

        expect(await harness.getBox()).toEqual({
            height: 44,
            paddingLeft: '12px',
            paddingRight: '12px',
            borderRadius: '10px',
        });
    });

    it('should draw no focus ring until it has focus', async () => {
        const { harness } = await setupTest();

        expect((await harness.getFocusRing()).style).toBe('none');
    });

    it('should draw the focus ring outside itself on keyboard focus', async () => {
        const { harness, link } = await setupTest();

        await userEvent.tab();

        await expect.element(link).toHaveFocus();
        expect(await harness.getFocusRing()).toEqual({
            style: 'solid',
            color: FOCUS_RING,
            width: '2px',
            offset: '2px',
        });
    });

    it('should keep its default look on keyboard focus', async () => {
        const { harness } = await setupTest();

        await userEvent.tab();

        expect(await harness.getLook()).toEqual(LOOKS.default);
    });

    it('should draw the bar kind for a kind it does not know', async () => {
        const { harness } = await setupTest(UnknownKindTestComponent);

        expect(await harness.getLook()).toEqual(LOOKS.default);
        expect((await harness.getBox()).paddingLeft).toBe('12px');
    });
});
