import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page, userEvent } from 'vitest/browser';
import { LinkComponent } from './link.component';
import { LinkKind } from './link.types';
import { LinkHarness, readColorToken, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

/** Leaves room around the link for its focus ring. */
const FRAME = `
    .frame {
        padding: 1rem;
    }
`;

/** How a kind looks in one state. */
interface Look {
    color: string;
    underlined: boolean;
    fontWeight: string;
}

/**
 * How each kind looks by default and on hover, as Penpot draws it, in the colors of the theme the test runs in. Focus
 * keeps the default look.
 */
function readLooks(): Record<LinkKind, { default: Look; hover: Look }> {
    const accentText = readColorToken('--color-accent-text');
    const foregroundDefault = readColorToken('--color-foreground-default');
    const foregroundMuted = readColorToken('--color-foreground-muted');

    return {
        inline: {
            default: { color: accentText, underlined: true, fontWeight: '400' },
            hover: { color: foregroundDefault, underlined: true, fontWeight: '400' },
        },
        standalone: {
            default: { color: accentText, underlined: false, fontWeight: '600' },
            hover: { color: accentText, underlined: true, fontWeight: '600' },
        },
        quiet: {
            default: { color: foregroundMuted, underlined: false, fontWeight: '400' },
            hover: { color: foregroundDefault, underlined: true, fontWeight: '400' },
        },
    };
}

describe('LinkComponent', () => {
    @Component({
        template: `<div class="frame"><a dma-link href="#rules">Rules</a></div>`,
        styles: FRAME,
        imports: [LinkComponent],
    })
    class DefaultTestComponent {}

    @Component({
        template: `<div class="frame"><a dma-link [kind]="kind()" href="#rules">Rules</a></div>`,
        styles: FRAME,
        imports: [LinkComponent],
    })
    class TestComponent {
        public readonly kind = signal<LinkKind>(LinkKind.Inline);
    }

    async function setupTest(kind: LinkKind) {
        const { fixture, harness } = await setupTestEnvironment({ host: TestComponent, harness: LinkHarness });

        fixture.componentInstance.kind.set(kind);
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
            const { harness, link } = await setupTest(kind);

            await expect.element(link).toBeInTheDocument();
            expect(await harness.getText()).toBe('Rules');
        });

        it('should draw its default look', async () => {
            const { harness } = await setupTest(kind);

            expect(await readLook(harness)).toEqual(readLooks()[kind].default);
        });

        it('should draw its hover look', async () => {
            const { harness, link } = await setupTest(kind);

            await userEvent.hover(link);
            const look = await readLook(harness);
            await userEvent.unhover(link);

            expect(look).toEqual(readLooks()[kind].hover);
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
                color: readColorToken('--color-focus-ring'),
                width: '2px',
                offset: '2px',
            });
        });

        it('should keep its default look on keyboard focus', async () => {
            const { harness } = await setupTest(kind);

            await userEvent.tab();

            expect(await readLook(harness)).toEqual(readLooks()[kind].default);
        });
    });

    it('should draw the inline kind by default', async () => {
        const { harness } = await setupTestEnvironment({ host: DefaultTestComponent, harness: LinkHarness });

        expect(await readLook(harness)).toEqual(readLooks().inline.default);
        expect(await harness.hasArrow()).toBe(false);
    });

    it('should draw the inline kind for a kind it does not know', async () => {
        const { harness } = await setupTest('unknown' as LinkKind);

        expect(await readLook(harness)).toEqual(readLooks().inline.default);
        expect(await harness.hasArrow()).toBe(false);
    });

    it('should end the standalone kind in a 20 px arrow', async () => {
        const { harness } = await setupTest(LinkKind.Standalone);

        expect(await harness.isArrowAtEnd()).toBe(true);
        expect(await harness.getArrowSize()).toEqual({ width: 20, height: 20 });
    });

    it.each<LinkKind>([LinkKind.Inline, LinkKind.Quiet])('should draw no arrow for the %s kind', async (kind) => {
        const { harness } = await setupTest(kind);

        expect(await harness.hasArrow()).toBe(false);
        expect(await harness.getArrowSize()).toBeNull();
        expect(await harness.isArrowAtEnd()).toBe(false);
    });
});
