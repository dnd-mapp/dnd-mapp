import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { DisclosureComponent } from './disclosure.component';
import { DisclosureHarness, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

// Colors that no theme uses, so each part can only take its color from the token the test sets it on.
const FOREGROUND_DEFAULT = 'rgb(240, 230, 220)';
const BORDER_DIVIDER = 'rgb(40, 50, 60)';

/**
 * Sets the semantic tokens that the disclosure reads to values of the test, rather than loading `tokens.css`, so each
 * expectation names the token it comes from. The container is wider than the measure, so the width test can tell the two
 * apart.
 */
const TOKENS = `
    .tokens {
        --border-width-default: 1px;
        --color-border-divider: ${BORDER_DIVIDER};
        --color-foreground-default: ${FOREGROUND_DEFAULT};
        --radius-sm: 8px;
        --size-measure: 400px;
        --size-target-min: 44px;
        --space-4: 4px;
        --space-12: 12px;
        --space-16: 16px;
        --typography-title-sm-font-weight: 700;
        width: 600px;
    }
`;

const SUMMARY = 'Can I play offline?';
const ANSWER = 'Yes, once the app has loaded.';

describe('DisclosureComponent', () => {
    @Component({
        template: `
            <div class="tokens">
                <details dma-disclosure>
                    <span dma-disclosure-summary>Can I play offline?</span>
                    <p>Yes, once the app has loaded.</p>
                </details>
            </div>
        `,
        styles: TOKENS,
        imports: [DisclosureComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({ host: TestComponent, harness: DisclosureHarness });

        TestBed.tick();

        return { harness, summary: page.getByText(SUMMARY, { exact: true }) };
    }

    it('should show the summary, end it in the plus, and hide the rest while closed', async () => {
        const { harness, summary } = await setupTest();

        expect(await harness.isOpen()).toBe(false);
        expect(await harness.getIcon()).toBe('plus');
        await expect.element(summary).toBeVisible();
        await expect.element(page.getByText(ANSWER, { exact: true })).not.toBeVisible();
    });

    it('should draw the summary label from its tokens', async () => {
        const { harness } = await setupTest();

        expect(await harness.getSummaryLook()).toEqual({ color: FOREGROUND_DEFAULT, fontWeight: '700' });
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
    // of the summary itself: the icon adds none to its name.
    it('should name the summary by its label alone', async () => {
        const { harness, summary } = await setupTest();

        expect(await harness.getSummaryText()).toBe(SUMMARY);
        expect(summary.element().closest('summary')?.textContent.trim()).toBe(SUMMARY);
    });
});
