import { Component, signal, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page, userEvent } from 'vitest/browser';
import { ChipComponent } from './chip.component';
import { ChipKind } from './chip.types';
import { ChipHarness, type ChipLook, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

// Colors that no theme uses, so the chip can only take each one from the token the test sets it on.
const BACKGROUND_RAISED = 'rgb(30, 40, 50)';
const BORDER_DIVIDER = 'rgb(40, 50, 60)';
const BORDER_CONTROL = 'rgb(120, 130, 140)';
const FOREGROUND_DEFAULT = 'rgb(240, 230, 220)';
const FOREGROUND_MUTED = 'rgb(170, 180, 190)';
const SECONDARY_DEFAULT = 'rgb(120, 200, 160)';
const FOREGROUND_ON_SECONDARY = 'rgb(15, 20, 25)';
const TRANSPARENT = 'rgba(0, 0, 0, 0)';

/**
 * Sets the semantic tokens that the chip reads to values of the test, rather than loading `tokens.css`, so each
 * expectation names the token it comes from.
 */
const TOKENS = `
    .tokens {
        --color-background-raised: ${BACKGROUND_RAISED};
        --color-border-divider: ${BORDER_DIVIDER};
        --color-border-control: ${BORDER_CONTROL};
        --color-foreground-default: ${FOREGROUND_DEFAULT};
        --color-foreground-muted: ${FOREGROUND_MUTED};
        --color-secondary-default: ${SECONDARY_DEFAULT};
        --color-foreground-on-secondary: ${FOREGROUND_ON_SECONDARY};
        --border-width-default: 1px;
        --radius-pill: 999px;
        --space-4: 4px;
        --space-8: 8px;
        --typography-label-font-size: 12px;
        --typography-label-font-weight: 600;
        --typography-label-line-height: 1.3;
        display: inline-block;
        padding: 1rem;
    }
`;

/** How each kind looks, as Penpot draws it. */
const LOOKS: Record<ChipKind, ChipLook> = {
    neutral: { background: BACKGROUND_RAISED, borderColor: BORDER_DIVIDER, color: FOREGROUND_DEFAULT },
    status: { background: TRANSPARENT, borderColor: BORDER_CONTROL, color: FOREGROUND_MUTED },
    dm: { background: SECONDARY_DEFAULT, borderColor: TRANSPARENT, color: FOREGROUND_ON_SECONDARY },
};

describe('ChipComponent', () => {
    @Component({
        template: `
            <div class="tokens">
                <dma-chip [kind]="kind()">Planned</dma-chip>
                <button type="button">Next</button>
            </div>
        `,
        styles: TOKENS,
        imports: [ChipComponent],
    })
    class ChipHostComponent {
        public readonly kind = signal<ChipKind>(ChipKind.Neutral);
    }

    @Component({
        template: `<div class="tokens"><dma-chip>Planned</dma-chip></div>`,
        styles: TOKENS,
        imports: [ChipComponent],
    })
    class DefaultHostComponent {}

    async function setupTest(host: Type<unknown>, kind?: ChipKind) {
        const { fixture, harness } = await setupTestEnvironment({ host, harness: ChipHarness });

        if (kind) {
            (fixture.componentInstance as ChipHostComponent).kind.set(kind);
        }
        TestBed.tick();

        return { harness };
    }

    describe.each<ChipKind>(Object.values(ChipKind))('of kind %s', (kind) => {
        it('should show its label', async () => {
            const { harness } = await setupTest(ChipHostComponent, kind);

            expect(await harness.getText()).toBe('Planned');
        });

        it('should draw its look', async () => {
            const { harness } = await setupTest(ChipHostComponent, kind);

            expect(await harness.getLook()).toEqual(LOOKS[kind]);
        });

        it('should not take focus', async () => {
            const { harness } = await setupTest(ChipHostComponent, kind);

            await userEvent.tab();

            await expect.element(page.getByRole('button', { name: 'Next' })).toHaveFocus();
            expect(await harness.isFocused()).toBe(false);
        });
    });

    it('should draw the neutral kind by default', async () => {
        const { harness } = await setupTest(DefaultHostComponent);

        expect(await harness.getLook()).toEqual(LOOKS.neutral);
    });

    it('should draw the neutral kind for a kind it does not know', async () => {
        const { harness } = await setupTest(ChipHostComponent, 'unknown' as ChipKind);

        expect(await harness.getLook()).toEqual(LOOKS.neutral);
    });
});
