import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page, userEvent } from 'vitest/browser';
import { DisclosureComponent } from './disclosure.component';
import { DisclosureHarness, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

// Colors that no theme uses, so each part can only take its color from the token the test sets it on.
const FOREGROUND_DEFAULT = 'rgb(240, 230, 220)';
const FOREGROUND_MUTED = 'rgb(170, 180, 190)';
const BORDER_DIVIDER = 'rgb(40, 50, 60)';
const BACKGROUND_HOVER = 'rgb(30, 40, 50)';
const FOCUS_RING = 'rgb(120, 180, 250)';
const TRANSPARENT = 'rgba(0, 0, 0, 0)';

/**
 * Sets the semantic tokens that the disclosure reads to values of the test, rather than loading `tokens.css`, so each
 * expectation names the token it comes from. The container is wider than the measure, so the width test can tell the two
 * apart.
 */
const TOKENS = `
    .tokens {
        --border-width-default: 1px;
        --border-width-focus: 2px;
        --color-background-hover: ${BACKGROUND_HOVER};
        --color-border-divider: ${BORDER_DIVIDER};
        --color-focus-ring: ${FOCUS_RING};
        --color-foreground-default: ${FOREGROUND_DEFAULT};
        --color-foreground-muted: ${FOREGROUND_MUTED};
        --focus-offset: 2px;
        --radius-sm: 8px;
        --size-measure: 400px;
        --size-target-min: 44px;
        --space-4: 4px;
        --space-12: 12px;
        --space-16: 16px;
        --typography-body-font-weight: 400;
        --typography-title-sm-font-weight: 700;
        width: 600px;
    }
`;

/** How the summary looks in each state, as Penpot draws it. Focus keeps the look of the state it adds to. */
const SUMMARY_LOOKS = {
    default: { background: TRANSPARENT, color: FOREGROUND_DEFAULT, fontWeight: '700' },
    hover: { background: BACKGROUND_HOVER, color: FOREGROUND_DEFAULT, fontWeight: '700' },
};

const SUMMARY = 'Can I play offline?';
const ANSWER = 'Yes, once the app has loaded.';

describe('DisclosureComponent', () => {
    @Component({
        template: `
            <div class="tokens">
                <details dma-disclosure [open]="open()">
                    <span dma-disclosure-summary>Can I play offline?</span>
                    <p>Yes, once the app has loaded.</p>
                </details>
            </div>
        `,
        styles: TOKENS,
        imports: [DisclosureComponent],
    })
    class TestComponent {
        public readonly open = signal(false);
    }

    async function setupTest(open = false) {
        const { fixture, harness } = await setupTestEnvironment({ host: TestComponent, harness: DisclosureHarness });

        fixture.componentInstance.open.set(open);
        TestBed.tick();

        return {
            harness,
            summary: page.getByText(SUMMARY, { exact: true }),
            answer: page.getByText(ANSWER, { exact: true }),
        };
    }

    it('should show the summary, end it in the plus, and hide the panel while closed', async () => {
        const { harness, summary, answer } = await setupTest();

        expect(await harness.isOpen()).toBe(false);
        expect(await harness.getIcon()).toBe('plus');
        await expect.element(summary).toBeVisible();
        await expect.element(answer).not.toBeVisible();
    });

    it('should show the summary, end it in the minus, and show the panel while open', async () => {
        const { harness, summary, answer } = await setupTest(true);

        expect(await harness.isOpen()).toBe(true);
        expect(await harness.getIcon()).toBe('minus');
        await expect.element(summary).toBeVisible();
        await expect.element(answer).toBeVisible();
    });

    it('should keep the text of a closed panel findable', async () => {
        const { harness } = await setupTest();

        expect(await harness.getPanelText()).toBe(ANSWER);
        expect(await harness.isPanelFindable()).toBe(true);
    });

    it.each([
        ['open', false],
        ['close', true],
    ])('should %s when the summary is clicked', async (_, open) => {
        const { harness, summary } = await setupTest(open);

        await userEvent.click(summary);

        expect(await harness.isOpen()).toBe(!open);
        expect(await harness.getIcon()).toBe(open ? 'plus' : 'minus');
    });

    describe.each([
        ['Enter', '{Enter}'],
        ['Space', ' '],
    ])('by the %s key', (_, key) => {
        it.each([
            ['open', false],
            ['close', true],
        ])('should %s on the focused summary', async (__, open) => {
            const { harness } = await setupTest(open);

            await userEvent.tab();
            await userEvent.keyboard(key);

            expect(await harness.isOpen()).toBe(!open);
        });
    });

    it('should draw the summary label and the panel text from their tokens', async () => {
        const { harness } = await setupTest(true);

        expect(await harness.getSummaryLook()).toEqual(SUMMARY_LOOKS.default);
        expect(await harness.getPanelLook()).toEqual({
            background: TRANSPARENT,
            color: FOREGROUND_MUTED,
            fontWeight: '400',
        });
    });

    describe.each([
        ['closed', false],
        ['open', true],
    ])('while %s', (_, open) => {
        it('should fill the summary on hover', async () => {
            const { harness, summary } = await setupTest(open);

            await userEvent.hover(summary);
            const look = await harness.getSummaryLook();
            await userEvent.unhover(summary);

            expect(look).toEqual(SUMMARY_LOOKS.hover);
        });

        it('should draw no focus ring until the summary has focus', async () => {
            const { harness } = await setupTest(open);

            expect((await harness.getFocusRing()).style).toBe('none');
        });

        it('should draw the focus ring outside the summary on keyboard focus, and keep its default look', async () => {
            const { harness } = await setupTest(open);

            await userEvent.tab();

            expect(await harness.getFocusRing()).toEqual({
                style: 'solid',
                color: FOCUS_RING,
                width: '2px',
                offset: '2px',
            });
            expect(await harness.getSummaryLook()).toEqual(SUMMARY_LOOKS.default);
        });
    });

    it('should draw no focus ring when a click focuses the summary', async () => {
        const { harness, summary } = await setupTest();

        await userEvent.click(summary);
        await userEvent.unhover(summary);

        expect(document.activeElement?.localName).toBe('summary');
        expect((await harness.getFocusRing()).style).toBe('none');
    });

    it('should pad the summary around its icon, as Penpot draws it', async () => {
        const { harness } = await setupTest();

        expect(await harness.getSummaryBox()).toEqual({
            height: 12 + 24 + 12,
            padding: '12px 16px',
            borderRadius: '8px',
        });
    });

    it('should make the summary at least as tall as the minimum target size', async () => {
        const { harness } = await setupTest();

        document.querySelector<HTMLElement>('.tokens')?.style.setProperty('--size-target-min', '60px');

        expect((await harness.getSummaryBox()).height).toBe(60);
    });

    it('should fill its container up to the measure, with the divider over its bottom padding', async () => {
        const { harness } = await setupTest();

        expect(await harness.getDivider()).toEqual({ style: 'solid', color: BORDER_DIVIDER, width: '1px' });
        expect(await harness.getSize()).toEqual({ width: 400, height: 4 + 48 + 4 });
    });

    // Locators find no role for `<summary>`, which Chromium exposes as a disclosure triangle, so the test reads the text
    // of the summary itself: the icons add none to its name.
    it('should name the summary by its label alone', async () => {
        const { harness, summary } = await setupTest();

        expect(await harness.getSummaryText()).toBe(SUMMARY);
        expect(summary.element().closest('summary')?.textContent.trim()).toBe(SUMMARY);
    });
});
