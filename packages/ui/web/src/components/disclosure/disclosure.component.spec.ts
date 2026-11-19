import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page, userEvent } from 'vitest/browser';
import { DisclosureComponent } from './disclosure.component';
import { DisclosureHarness, readColorToken, setupTestEnvironment } from '@critsource/ui-web/testing';

const TRANSPARENT = 'rgba(0, 0, 0, 0)';

/** Makes the container wider than the measure of `tokens.css`, 720 px, so the width test can tell the two apart. */
const CONTAINER = `
    .container {
        width: 800px;
    }
`;

/**
 * How the summary looks in each state, as Penpot draws it, in the colors of the theme the test runs in. Focus keeps
 * the look of the state it adds to.
 */
function readSummaryLooks() {
    const foregroundDefault = readColorToken('--color-foreground-default');

    return {
        default: { background: TRANSPARENT, color: foregroundDefault, fontWeight: '700' },
        hover: { background: readColorToken('--color-background-hover'), color: foregroundDefault, fontWeight: '700' },
    };
}

const SUMMARY = 'Can I play offline?';
const ANSWER = 'Yes, once the app has loaded.';

describe('DisclosureComponent', () => {
    @Component({
        template: `
            <div class="container">
                <details dma-disclosure [open]="open()">
                    <span dma-disclosure-summary>Can I play offline?</span>
                    <p>Yes, once the app has loaded.</p>
                </details>
            </div>
        `,
        styles: CONTAINER,
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

        expect(await harness.getSummaryLook()).toEqual(readSummaryLooks().default);
        expect(await harness.getPanelLook()).toEqual({
            background: TRANSPARENT,
            color: readColorToken('--color-foreground-muted'),
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

            expect(look).toEqual(readSummaryLooks().hover);
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
                color: readColorToken('--color-focus-ring'),
                width: '2px',
                offset: '2px',
            });
            expect(await harness.getSummaryLook()).toEqual(readSummaryLooks().default);
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

        document.querySelector<HTMLElement>('.container')?.style.setProperty('--size-target-min', '60px');

        expect((await harness.getSummaryBox()).height).toBe(60);
    });

    it('should fill its container up to the measure, with the divider over its bottom padding', async () => {
        const { harness } = await setupTest();

        expect(await harness.getDivider()).toEqual({
            style: 'solid',
            color: readColorToken('--color-border-divider'),
            width: '1px',
        });
        expect(await harness.getSize()).toEqual({ width: 720, height: 4 + 48 + 4 });
    });

    // Locators find no role for `<summary>`, which Chromium exposes as a disclosure triangle, so the test reads the text
    // of the summary itself: the icons add none to its name.
    it('should name the summary by its label alone', async () => {
        const { harness, summary } = await setupTest();

        expect(await harness.getSummaryText()).toBe(SUMMARY);
        expect(summary.element().closest('summary')?.textContent.trim()).toBe(SUMMARY);
    });
});
