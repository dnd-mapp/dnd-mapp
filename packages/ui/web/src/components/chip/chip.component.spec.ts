import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page, userEvent } from 'vitest/browser';
import { ChipComponent } from './chip.component';
import { ChipKind } from './chip.types';
import { ChipHarness, type ChipLook, readColorToken, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

const TRANSPARENT = 'rgba(0, 0, 0, 0)';

/** How each kind looks, as Penpot draws it, in the colors of the theme the test runs in. */
function readLooks(): Record<ChipKind, ChipLook> {
    return {
        neutral: {
            background: readColorToken('--color-background-raised'),
            borderColor: readColorToken('--color-border-divider'),
            color: readColorToken('--color-foreground-default'),
        },
        status: {
            background: TRANSPARENT,
            borderColor: readColorToken('--color-border-control'),
            color: readColorToken('--color-foreground-muted'),
        },
        dm: {
            background: readColorToken('--color-secondary-default'),
            borderColor: TRANSPARENT,
            color: readColorToken('--color-foreground-on-secondary'),
        },
    };
}

describe('ChipComponent', () => {
    @Component({
        template: `
            <dma-chip [kind]="kind()">Planned</dma-chip>
            <button type="button">Next</button>
        `,
        imports: [ChipComponent],
    })
    class ChipHostComponent {
        public readonly kind = signal<ChipKind>(ChipKind.Neutral);
    }

    @Component({
        template: `<dma-chip>Planned</dma-chip>`,
        imports: [ChipComponent],
    })
    class DefaultHostComponent {}

    async function setupTest(kind: ChipKind) {
        const { fixture, harness } = await setupTestEnvironment({ host: ChipHostComponent, harness: ChipHarness });

        fixture.componentInstance.kind.set(kind);
        TestBed.tick();

        return { harness };
    }

    describe.each<ChipKind>(Object.values(ChipKind))('of kind %s', (kind) => {
        it('should show its label', async () => {
            const { harness } = await setupTest(kind);

            expect(await harness.getText()).toBe('Planned');
        });

        it('should draw its look', async () => {
            const { harness } = await setupTest(kind);

            expect(await harness.getLook()).toEqual(readLooks()[kind]);
        });

        it('should not take focus', async () => {
            const { harness } = await setupTest(kind);

            await userEvent.tab();

            await expect.element(page.getByRole('button', { name: 'Next' })).toHaveFocus();
            expect(await harness.isFocused()).toBe(false);
        });
    });

    it('should draw the neutral kind by default', async () => {
        const { harness } = await setupTestEnvironment({ host: DefaultHostComponent, harness: ChipHarness });

        expect(await harness.getLook()).toEqual(readLooks().neutral);
    });

    it('should draw the neutral kind for a kind it does not know', async () => {
        const { harness } = await setupTest('unknown' as ChipKind);

        expect(await harness.getLook()).toEqual(readLooks().neutral);
    });
});
