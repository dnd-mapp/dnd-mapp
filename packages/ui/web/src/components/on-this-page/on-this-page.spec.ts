import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page, userEvent } from 'vitest/browser';
import { OnThisPageLinkComponent } from './on-this-page-link.component';
import {
    OnThisPageLinkHarness,
    type OnThisPageLinkLook,
    readColorToken,
    setupTestEnvironment,
} from '@dnd-mapp/ui-web/testing';

const TRANSPARENT = 'rgba(0, 0, 0, 0)';

/**
 * The width of `.container`, the 240 px column of Penpot, so the width test can tell filling it from fitting the label.
 * Angular reads `styles` while it compiles, so they repeat the value rather than interpolate it.
 */
const CONTAINER_WIDTH = 240;

/** The height of a label on one line: the 14 px of `typography.body-sm` at a line height of 1.5. */
const LABEL_HEIGHT = 21;

/**
 * How the link looks in each state, as Penpot draws it, in the colors of the theme the test runs in. Focus keeps the
 * look of the state it adds to, and Penpot draws no hovered current link, which keeps the accent color.
 */
function readLooks(): Record<'default' | 'hover' | 'current', OnThisPageLinkLook> {
    return {
        default: { background: TRANSPARENT, color: readColorToken('--color-foreground-muted'), fontWeight: '400' },
        hover: { background: TRANSPARENT, color: readColorToken('--color-foreground-default'), fontWeight: '400' },
        current: { background: TRANSPARENT, color: readColorToken('--color-accent-text'), fontWeight: '400' },
    };
}

describe('OnThisPageLinkComponent', () => {
    @Component({
        template: `
            <div class="container">
                <a dma-on-this-page-link [attr.aria-current]="current() ? 'location' : null" href="#your-rights">
                    Your rights
                </a>
            </div>
        `,
        styles: `
            .container {
                width: 240px;
                padding: 1rem;
            }
        `,
        imports: [OnThisPageLinkComponent],
    })
    class TestComponent {
        public readonly current = signal(false);
    }

    async function setupTest(current = false) {
        const { fixture, harness } = await setupTestEnvironment({
            host: TestComponent,
            harness: OnThisPageLinkHarness,
        });

        fixture.componentInstance.current.set(current);
        TestBed.tick();

        return { harness, link: page.getByRole('link', { name: 'Your rights', exact: true }) };
    }

    /** Expects the 2 px indicator with rounded ends at the start of the link, as tall as its label, in `token`. */
    async function expectIndicator(harness: OnThisPageLinkHarness, token: `--color-${string}`) {
        expect(await harness.getIndicator()).toEqual({
            color: readColorToken(token),
            borderRadius: '1px',
            left: 0,
            top: 8,
            width: 2,
            height: LABEL_HEIGHT,
        });
    }

    it('should be a link to its section, named by its label alone', async () => {
        const { harness, link } = await setupTest();

        await expect.element(link).toHaveAttribute('href', '#your-rights');
        expect(await harness.getText()).toBe('Your rights');
    });

    it('should draw its default look and the indicator in the divider color', async () => {
        const { harness } = await setupTest();

        expect(await harness.getLook()).toEqual(readLooks().default);
        await expectIndicator(harness, '--color-border-divider');
    });

    it('should pad its label, with rounded corners, as Penpot draws it', async () => {
        const { harness } = await setupTest();

        expect(await harness.getBox()).toEqual({
            height: 8 + LABEL_HEIGHT + 8,
            padding: '8px 16px',
            borderRadius: '8px',
        });
    });

    it('should fill its container', async () => {
        const { harness } = await setupTest();

        expect((await harness.getSize()).width).toBe(CONTAINER_WIDTH);
    });

    it('should keep the indicator as tall as a label that wraps', async () => {
        const { harness } = await setupTest();

        document.querySelector<HTMLElement>('.container')?.style.setProperty('width', '80px');
        const { height } = await harness.getSize();

        expect(height).toBe(8 + 2 * LABEL_HEIGHT + 8);
        expect((await harness.getIndicator()).height).toBe(2 * LABEL_HEIGHT);
    });

    it('should turn its label to the default color on hover, and keep the indicator', async () => {
        const { harness, link } = await setupTest();

        await userEvent.hover(link);
        const look = await harness.getLook();
        const indicator = await harness.getIndicator();
        await userEvent.unhover(link);

        expect(look).toEqual(readLooks().hover);
        expect(indicator.color).toBe(readColorToken('--color-border-divider'));
    });

    it('should draw no focus ring until it has focus', async () => {
        const { harness } = await setupTest();

        expect((await harness.getFocusRing()).style).toBe('none');
    });

    it('should draw the focus ring outside itself on keyboard focus, and keep its default look', async () => {
        const { harness, link } = await setupTest();

        await userEvent.tab();

        await expect.element(link).toHaveFocus();
        expect(await harness.getFocusRing()).toEqual({
            style: 'solid',
            color: readColorToken('--color-focus-ring'),
            width: '2px',
            offset: '2px',
        });
        expect(await harness.getLook()).toEqual(readLooks().default);
    });

    it('should mark no section by default', async () => {
        const { harness, link } = await setupTest();

        await expect.element(link).not.toHaveAttribute('aria-current');
        expect(await harness.isCurrent()).toBe(false);
    });

    describe('for the section in view', () => {
        it('should mark the section in view to assistive technology', async () => {
            const { harness, link } = await setupTest(true);

            await expect.element(link).toHaveAttribute('aria-current', 'location');
            expect(await harness.isCurrent()).toBe(true);
        });

        it('should draw its label and the indicator in the accent color', async () => {
            const { harness } = await setupTest(true);

            expect(await harness.getLook()).toEqual(readLooks().current);
            await expectIndicator(harness, '--color-accent-text');
        });

        it('should keep its current look on hover', async () => {
            const { harness, link } = await setupTest(true);

            await userEvent.hover(link);
            const look = await harness.getLook();
            const indicator = await harness.getIndicator();
            await userEvent.unhover(link);

            expect(look).toEqual(readLooks().current);
            expect(indicator.color).toBe(readColorToken('--color-accent-text'));
        });

        it('should keep its current look on keyboard focus', async () => {
            const { harness } = await setupTest(true);

            await userEvent.tab();

            expect((await harness.getFocusRing()).style).toBe('solid');
            expect(await harness.getLook()).toEqual(readLooks().current);
            await expectIndicator(harness, '--color-accent-text');
        });
    });
});
