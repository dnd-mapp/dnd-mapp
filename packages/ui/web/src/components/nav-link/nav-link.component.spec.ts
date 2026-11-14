import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page, userEvent } from 'vitest/browser';
import { NavLinkComponent } from './nav-link.component';
import { NavLinkKind } from './nav-link.types';
import {
    NavLinkHarness,
    type NavLinkIndicator,
    type NavLinkLook,
    setupTestEnvironment,
} from '@dnd-mapp/ui-web/testing';

// Colors that no theme uses, so the nav link can only take each one from the token the test sets it on.
const ACCENT_TEXT = 'rgb(200, 30, 40)';
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
        --color-accent-text: ${ACCENT_TEXT};
        --color-background-hover: ${BACKGROUND_HOVER};
        --color-foreground-default: ${FOREGROUND_DEFAULT};
        --color-foreground-muted: ${FOREGROUND_MUTED};
        --color-focus-ring: ${FOCUS_RING};
        --border-width-focus: 2px;
        --focus-offset: 2px;
        --radius-md: 10px;
        --size-indicator: 2px;
        --size-target-min: 44px;
        --space-4: 4px;
        --space-12: 12px;
        --space-16: 16px;
        --typography-nav-font-size: 15px;
        --typography-nav-font-weight: 600;
        --typography-nav-line-height: 1.2;
        --typography-nav-text-decoration: none;
        --typography-title-sm-font-size: 18px;
        --typography-title-sm-font-weight: 700;
        --typography-title-sm-line-height: 1.3;
        --typography-title-sm-text-decoration: none;
        padding: 1rem;
    }
`;

/**
 * The width of `.tokens`, so the width tests can tell filling it from fitting the label. Angular reads `styles` while it
 * compiles, so they repeat the value rather than interpolate it.
 */
const CONTAINER_WIDTH = 320;

/**
 * How each kind looks in each state, as Penpot draws it. Focus keeps the look of the state it adds to. Penpot draws no
 * hovered current page, which takes the hover fill and keeps the label color of the current page.
 */
const LOOKS: Record<NavLinkKind, Record<'default' | 'hover' | 'current' | 'currentHover', NavLinkLook>> = {
    bar: {
        default: { background: TRANSPARENT, color: FOREGROUND_MUTED, fontWeight: '600' },
        hover: { background: BACKGROUND_HOVER, color: FOREGROUND_DEFAULT, fontWeight: '600' },
        current: { background: TRANSPARENT, color: FOREGROUND_DEFAULT, fontWeight: '600' },
        currentHover: { background: BACKGROUND_HOVER, color: FOREGROUND_DEFAULT, fontWeight: '600' },
    },
    row: {
        default: { background: TRANSPARENT, color: FOREGROUND_DEFAULT, fontWeight: '700' },
        hover: { background: BACKGROUND_HOVER, color: FOREGROUND_DEFAULT, fontWeight: '700' },
        current: { background: TRANSPARENT, color: ACCENT_TEXT, fontWeight: '700' },
        currentHover: { background: BACKGROUND_HOVER, color: ACCENT_TEXT, fontWeight: '700' },
    },
};

/** The inline padding of each kind. */
const PADDING: Record<NavLinkKind, string> = { bar: '12px', row: '16px' };

type IndicatorPlace = Pick<NavLinkIndicator, 'left' | 'top' | 'width' | 'height'>;

/**
 * Where each kind draws the 2 px indicator of the current page, relative to its label: 4 px under the label of a bar
 * and as wide as the label, or at the start of a row and as tall as the label.
 */
const INDICATOR_PLACES: Record<NavLinkKind, (label: { width: number; height: number }) => IndicatorPlace> = {
    bar: (label) => ({ left: 0, top: label.height + 4, width: label.width, height: 2 }),
    row: (label) => ({ left: -16, top: 0, width: 2, height: label.height }),
};

describe('NavLinkComponent', () => {
    @Component({
        template: `
            <div class="tokens">
                <a dma-nav-link [kind]="kind()" [attr.aria-current]="current() ? 'page' : null" href="#">Features</a>
            </div>
        `,
        styles: [
            TOKENS,
            `
                .tokens {
                    width: 320px;
                }
            `,
        ],
        imports: [NavLinkComponent],
    })
    class TestComponent {
        public readonly kind = signal<NavLinkKind>(NavLinkKind.Bar);
        public readonly current = signal(false);
    }

    async function setupTest(kind: NavLinkKind = NavLinkKind.Bar, current = false) {
        const { fixture, harness } = await setupTestEnvironment({ host: TestComponent, harness: NavLinkHarness });

        fixture.componentInstance.kind.set(kind);
        fixture.componentInstance.current.set(current);
        TestBed.tick();

        return { harness, link: page.getByRole('link', { name: 'Features', exact: true }) };
    }

    /** Expects the indicator of the current page in the accent color, with rounded ends, where the kind draws it. */
    async function expectIndicator(harness: NavLinkHarness, kind: NavLinkKind) {
        const place = INDICATOR_PLACES[kind](await harness.getLabelSize());
        const indicator = await harness.getIndicator();

        expect(indicator).toMatchObject({ color: ACCENT_TEXT, borderRadius: '1px' });
        expect(indicator?.left).toBeCloseTo(place.left);
        expect(indicator?.top).toBeCloseTo(place.top);
        expect(indicator?.width).toBeCloseTo(place.width);
        expect(indicator?.height).toBeCloseTo(place.height);
    }

    describe.each<NavLinkKind>(Object.values(NavLinkKind))('of kind %s', (kind) => {
        it('should be a link named by its label alone', async () => {
            const { harness, link } = await setupTest(kind);

            await expect.element(link).toBeInTheDocument();
            expect(await harness.getText()).toBe('Features');
        });

        it('should draw its default look', async () => {
            const { harness } = await setupTest(kind);

            expect(await harness.getLook()).toEqual(LOOKS[kind].default);
        });

        it('should draw its hover look', async () => {
            const { harness, link } = await setupTest(kind);

            await userEvent.hover(link);
            const look = await harness.getLook();
            await userEvent.unhover(link);

            expect(look).toEqual(LOOKS[kind].hover);
        });

        it('should be as tall as the minimum target size, with padding at each side and rounded corners', async () => {
            const { harness } = await setupTest(kind);

            expect(await harness.getBox()).toEqual({
                height: 44,
                paddingLeft: PADDING[kind],
                paddingRight: PADDING[kind],
                borderRadius: '10px',
            });
        });

        it('should draw no focus ring until it has focus', async () => {
            const { harness } = await setupTest(kind);

            expect((await harness.getFocusRing()).style).toBe('none');
        });

        it('should draw the focus ring outside itself on keyboard focus', async () => {
            const { harness, link } = await setupTest(kind);

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
            const { harness } = await setupTest(kind);

            await userEvent.tab();

            expect(await harness.getLook()).toEqual(LOOKS[kind].default);
        });

        it('should mark no page and draw no indicator by default', async () => {
            const { harness } = await setupTest(kind);

            expect(await harness.isCurrent()).toBe(false);
            expect(await harness.getIndicator()).toBeNull();
        });

        describe('on the current page', () => {
            it('should mark the current page to assistive technology', async () => {
                const { harness, link } = await setupTest(kind, true);

                await expect.element(link).toHaveAttribute('aria-current', 'page');
                expect(await harness.isCurrent()).toBe(true);
                expect(await harness.getText()).toBe('Features');
            });

            it('should draw its current look and the indicator', async () => {
                const { harness } = await setupTest(kind, true);

                expect(await harness.getLook()).toEqual(LOOKS[kind].current);
                await expectIndicator(harness, kind);
            });

            it('should keep its label color and the indicator on hover', async () => {
                const { harness, link } = await setupTest(kind, true);

                await userEvent.hover(link);
                const look = await harness.getLook();
                await expectIndicator(harness, kind);
                await userEvent.unhover(link);

                expect(look).toEqual(LOOKS[kind].currentHover);
            });

            it('should keep its current look and the indicator on keyboard focus', async () => {
                const { harness, link } = await setupTest(kind, true);

                await userEvent.tab();

                await expect.element(link).toHaveFocus();
                expect((await harness.getFocusRing()).style).toBe('solid');
                expect(await harness.getLook()).toEqual(LOOKS[kind].current);
                await expectIndicator(harness, kind);
            });

            it('should keep its height', async () => {
                const { harness } = await setupTest(kind, true);

                expect((await harness.getBox()).height).toBe(44);
            });
        });
    });

    it('should draw the bar kind for a kind it does not know', async () => {
        const { harness } = await setupTest('unknown' as NavLinkKind);

        expect(await harness.getLook()).toEqual(LOOKS.bar.default);
        expect((await harness.getBox()).paddingLeft).toBe(PADDING.bar);
    });

    describe('width', () => {
        it('should be as wide as its label and padding in the bar kind', async () => {
            const { harness } = await setupTest(NavLinkKind.Bar);

            const { width } = await harness.getLabelSize();

            expect((await harness.getSize()).width).toBeCloseTo(width + 2 * 12);
        });

        it('should fill its container in the row kind', async () => {
            const { harness } = await setupTest(NavLinkKind.Row);

            expect((await harness.getSize()).width).toBe(CONTAINER_WIDTH);
        });
    });
});
