import { Component, signal, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page, userEvent } from 'vitest/browser';
import { LinkComponent } from './link.component';
import { LinkKind } from './link.types';
import { LinkHarness, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

// Colors that no theme uses, so the link can only take each one from the token the test sets it on.
const ACCENT_TEXT = 'rgb(200, 30, 40)';
const FOREGROUND_DEFAULT = 'rgb(20, 120, 40)';
const FOREGROUND_MUTED = 'rgb(90, 90, 200)';
const FOCUS_RING = 'rgb(0, 100, 250)';

/**
 * Sets the semantic tokens that the link reads to values of the test, rather than loading `tokens.css`, so each
 * expectation names the token it comes from.
 */
const TOKENS = `
    .tokens {
        --color-accent-text: ${ACCENT_TEXT};
        --color-foreground-default: ${FOREGROUND_DEFAULT};
        --color-foreground-muted: ${FOREGROUND_MUTED};
        --color-focus-ring: ${FOCUS_RING};
        --border-width-focus: 2px;
        --focus-offset: 2px;
        --size-icon-sm: 20px;
        --space-8: 8px;
        --typography-body-font-weight: 400;
        --typography-body-text-decoration: none;
        --typography-body-strong-font-weight: 600;
        --typography-body-strong-text-decoration: none;
        --typography-link-font-weight: 400;
        --typography-link-text-decoration: underline;
        --typography-link-strong-font-weight: 600;
        --typography-link-strong-text-decoration: underline;
        padding: 1rem;
    }
`;

/** How a kind looks in one state. */
interface Look {
    color: string;
    underlined: boolean;
    fontWeight: string;
}

/** How each kind looks by default and on hover, as Penpot draws it. Focus keeps the default look. */
const LOOKS: Record<LinkKind, { default: Look; hover: Look }> = {
    inline: {
        default: { color: ACCENT_TEXT, underlined: true, fontWeight: '400' },
        hover: { color: FOREGROUND_DEFAULT, underlined: true, fontWeight: '400' },
    },
    standalone: {
        default: { color: ACCENT_TEXT, underlined: false, fontWeight: '600' },
        hover: { color: ACCENT_TEXT, underlined: true, fontWeight: '600' },
    },
    quiet: {
        default: { color: FOREGROUND_MUTED, underlined: false, fontWeight: '400' },
        hover: { color: FOREGROUND_DEFAULT, underlined: true, fontWeight: '400' },
    },
};

describe('LinkComponent', () => {
    @Component({
        template: `<div class="tokens"><a dma-link href="#rules">Rules</a></div>`,
        styles: TOKENS,
        imports: [LinkComponent],
    })
    class DefaultTestComponent {}

    @Component({
        template: `<div class="tokens"><a dma-link [kind]="kind()" href="#rules">Rules</a></div>`,
        styles: TOKENS,
        imports: [LinkComponent],
    })
    class TestComponent {
        public readonly kind = signal<LinkKind>(LinkKind.Inline);
    }

    async function setupTest(host: Type<unknown>, kind?: LinkKind) {
        const { fixture, harness } = await setupTestEnvironment({ host, harness: LinkHarness });

        if (kind) {
            (fixture.componentInstance as TestComponent).kind.set(kind);
        }
        TestBed.tick();

        return { harness, link: page.getByRole('link', { name: 'Rules', exact: true }) };
    }

    async function readLook(harness: LinkHarness): Promise<Look> {
        return {
            color: await harness.getColor(),
            underlined: await harness.isUnderlined(),
            fontWeight: await harness.getFontWeight(),
        };
    }

    describe.each<LinkKind>(Object.values(LinkKind))('of kind %s', (kind) => {
        it('should be a link named by its label alone', async () => {
            const { harness, link } = await setupTest(TestComponent, kind);

            await expect.element(link).toBeInTheDocument();
            expect(await harness.getText()).toBe('Rules');
        });

        it('should draw its default look', async () => {
            const { harness } = await setupTest(TestComponent, kind);

            expect(await readLook(harness)).toEqual(LOOKS[kind].default);
        });

        it('should draw its hover look', async () => {
            const { harness, link } = await setupTest(TestComponent, kind);

            await userEvent.hover(link);
            const look = await readLook(harness);
            await userEvent.unhover(link);

            expect(look).toEqual(LOOKS[kind].hover);
        });

        it('should draw no focus ring until it has focus', async () => {
            const { harness } = await setupTest(TestComponent, kind);

            expect((await harness.getFocusRing()).style).toBe('none');
        });

        it('should draw the focus ring outside itself on keyboard focus', async () => {
            const { harness, link } = await setupTest(TestComponent, kind);

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
            const { harness } = await setupTest(TestComponent, kind);

            await userEvent.tab();

            expect(await readLook(harness)).toEqual(LOOKS[kind].default);
        });
    });

    it('should draw the inline kind by default', async () => {
        const { harness } = await setupTest(DefaultTestComponent);

        expect(await readLook(harness)).toEqual(LOOKS.inline.default);
        expect(await harness.hasArrow()).toBe(false);
    });

    it('should draw the inline kind for a kind it does not know', async () => {
        const { harness } = await setupTest(TestComponent, 'unknown' as LinkKind);

        expect(await readLook(harness)).toEqual(LOOKS.inline.default);
        expect(await harness.hasArrow()).toBe(false);
    });

    it('should end the standalone kind in a 20 px arrow', async () => {
        const { harness } = await setupTest(TestComponent, LinkKind.Standalone);

        expect(await harness.isArrowAtEnd()).toBe(true);
        expect(await harness.getArrowSize()).toEqual({ width: 20, height: 20 });
    });

    it.each<LinkKind>([LinkKind.Inline, LinkKind.Quiet])('should draw no arrow for the %s kind', async (kind) => {
        const { harness } = await setupTest(TestComponent, kind);

        expect(await harness.hasArrow()).toBe(false);
        expect(await harness.getArrowSize()).toBeNull();
        expect(await harness.isArrowAtEnd()).toBe(false);
    });
});
