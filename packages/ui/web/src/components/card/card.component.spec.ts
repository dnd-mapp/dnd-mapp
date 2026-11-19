import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page, userEvent } from 'vitest/browser';
import { CardComponent } from './card.component';
import { CardBackground } from './card.types';
import { ChipComponent } from '../chip';
import { LinkComponent } from '../link';
import {
    CardHarness,
    type CardLook,
    type CardPartBox,
    type CardPartLook,
    readColorToken,
    setupTestEnvironment,
} from '@critsource/ui-web/testing';

/** How the box of a card looks on each background, as Penpot draws it, in the colors of the theme the test runs in. */
function readLooks(): Record<CardBackground, CardLook> {
    const border = { borderColor: readColorToken('--color-border-divider'), borderWidth: '1px', borderRadius: '12px' };

    return {
        surface: { background: readColorToken('--color-background-surface'), ...border },
        raised: { background: readColorToken('--color-background-raised'), ...border },
    };
}

/** How each part draws its text, as Penpot draws it, in the colors of the theme the test runs in. */
function readPartLooks(): Record<'title' | 'text', CardPartLook> {
    return {
        title: { color: readColorToken('--color-foreground-default'), fontWeight: '800', textTransform: 'none' },
        text: { color: readColorToken('--color-foreground-muted'), fontWeight: '400', textTransform: 'none' },
    };
}

describe('CardComponent', () => {
    // The source places the parts in reverse, so every test also checks that the card draws them in Penpot's order.
    @Component({
        template: `
            <div [style.width.px]="width()">
                <dma-card [background]="background()">
                    @if (action()) {
                        <a dma-link kind="standalone" href="#">Open your characters</a>
                    }
                    @for (chip of chips(); track chip) {
                        <dma-chip>{{ chip }}</dma-chip>
                    }
                    <p>Build character sheets and keep their spell books.</p>
                    <h3>Characters</h3>
                </dma-card>
            </div>
            <button type="button">Next</button>
        `,
        imports: [CardComponent, ChipComponent, LinkComponent],
    })
    class TestComponent {
        public readonly width = signal(600);
        public readonly background = signal<CardBackground>(CardBackground.Surface);
        public readonly chips = signal<string[]>([]);
        public readonly action = signal(false);
    }

    @Component({
        template: `
            <div style="width: 600px">
                <dma-card><h2>Characters</h2></dma-card>
            </div>
        `,
        imports: [CardComponent],
    })
    class TitleOnlyTestComponent {}

    async function setupTest(
        options: { width?: number; background?: CardBackground; chips?: string[]; action?: boolean } = {},
    ) {
        const { fixture, harness } = await setupTestEnvironment({ host: TestComponent, harness: CardHarness });

        if (options.width) {
            fixture.componentInstance.width.set(options.width);
        }
        if (options.background) {
            fixture.componentInstance.background.set(options.background);
        }
        if (options.chips) {
            fixture.componentInstance.chips.set(options.chips);
        }
        if (options.action) {
            fixture.componentInstance.action.set(true);
        }
        TestBed.tick();

        return { harness };
    }

    it('should project the title and the text', async () => {
        const { harness } = await setupTest();

        expect(await harness.getText('title')).toBe('Characters');
        expect(await harness.getText('text')).toBe('Build character sheets and keep their spell books.');
    });

    it('should project the chips and the action', async () => {
        const { harness } = await setupTest({ chips: ['Players', 'DM'], action: true });
        const [chips, action] = await Promise.all([harness.getChips(), harness.getAction()]);

        expect(await Promise.all(chips.map((chip) => chip.getText()))).toEqual(['Players', 'DM']);
        expect(await action?.getText()).toBe('Open your characters');
        expect(await action?.hasArrow()).toBe(true);
    });

    it('should draw the title, the text, the chips, and the action in that order, whatever their order in the source', async () => {
        const { harness } = await setupTest({ chips: ['Players', 'DM'], action: true });

        expect(await harness.getParts()).toEqual(['title', 'text', 'chips', 'action']);
    });

    it('should keep the title at the level its consumer picks, named by its own text only', async () => {
        await setupTest();

        await expect
            .element(page.getByRole('heading', { level: 3, name: 'Characters', exact: true }))
            .toBeInTheDocument();
    });

    it.each<CardBackground>(Object.values(CardBackground))(
        'should draw the %s background with a divider border',
        async (background) => {
            const { harness } = await setupTest({ background });

            expect(await harness.getLook()).toEqual(readLooks()[background]);
        },
    );

    it('should draw the surface background by default', async () => {
        const { harness } = await setupTestEnvironment({ host: TitleOnlyTestComponent, harness: CardHarness });

        expect(await harness.getLook()).toEqual(readLooks().surface);
    });

    it('should draw the surface background for a background it does not know', async () => {
        const { harness } = await setupTest({ background: 'page' as CardBackground });

        expect(await harness.getLook()).toEqual(readLooks().surface);
    });

    it('should draw the title and the text with their own color and typography', async () => {
        const { harness } = await setupTest();
        const looks = readPartLooks();

        expect(await harness.getPartLook('title')).toEqual(looks.title);
        expect(await harness.getPartLook('text')).toEqual(looks.text);
    });

    it('should place its parts 24 px inside its outer edge, 12 px apart, with no margins of their own', async () => {
        const { harness } = await setupTest();
        const [title, text, { height }] = await Promise.all([
            harness.getBox('title'),
            harness.getBox('text'),
            harness.getSize(),
        ]);

        expect(title.top).toBeCloseTo(24);
        expect(title.left).toBeCloseTo(24);
        expect(text.left).toBeCloseTo(24);
        expect(text.top - title.bottom).toBeCloseTo(12);
        expect(height - text.bottom).toBeCloseTo(24);
    });

    it('should fill its container, with the title and the text filling the card', async () => {
        const { harness } = await setupTest();

        expect((await harness.getSize()).width).toBe(600);
        expect((await harness.getBox('title')).width).toBe(552);
        expect((await harness.getBox('text')).width).toBe(552);
    });

    it('should stay 280 px wide in a narrower container', async () => {
        const { harness } = await setupTest({ width: 200 });

        expect((await harness.getSize()).width).toBe(280);
    });

    it('should leave no gap below a title without text', async () => {
        const { harness } = await setupTestEnvironment({ host: TitleOnlyTestComponent, harness: CardHarness });
        const [title, { height }] = await Promise.all([harness.getBox('title'), harness.getSize()]);

        expect(await harness.getText('text')).toBeNull();
        expect(height - title.bottom).toBeCloseTo(24);
    });

    it('should place the chips in a row, 8 px apart and 12 px below the text', async () => {
        const { harness } = await setupTest({ chips: ['Players', 'DM'] });
        const [text, chips, boxes, { height }] = await Promise.all([
            harness.getBox('text'),
            harness.getBox('chips'),
            harness.getChipBoxes(),
            harness.getSize(),
        ]);

        expect(boxes).toHaveLength(2);
        const [players, dm] = boxes as [CardPartBox, CardPartBox];

        expect(chips.top - text.bottom).toBeCloseTo(12);
        expect(players.left).toBeCloseTo(24);
        expect(dm.left - (players.left + players.width)).toBeCloseTo(8);
        expect(dm.top).toBeCloseTo(players.top);
        expect(height - chips.bottom).toBeCloseTo(24);
    });

    it('should wrap the chips onto rows 8 px apart when they do not fit in one', async () => {
        const { harness } = await setupTest({
            width: 200,
            chips: ['Players', 'Dungeon Master', 'Spellcasters', 'Homebrew', 'Planned'],
        });
        const boxes = await harness.getChipBoxes();
        const tops = [...new Set(boxes.map((box) => box.top))];

        expect(tops.length).toBeGreaterThan(1);
        const [firstRow, secondRow] = tops.map((top) => boxes.filter((box) => box.top === top)) as [
            [CardPartBox],
            [CardPartBox],
        ];

        expect(secondRow[0].top - firstRow[0].bottom).toBeCloseTo(8);
        expect(secondRow[0].left).toBeCloseTo(24);
        expect(Math.max(...boxes.map((box) => box.left + box.width))).toBeLessThanOrEqual(280 - 24);
    });

    it('should place the action 12 px below the chips, as wide as its label', async () => {
        const { harness } = await setupTest({ chips: ['Players', 'DM'], action: true });
        const [chips, action, { height }] = await Promise.all([
            harness.getBox('chips'),
            harness.getBox('action'),
            harness.getSize(),
        ]);

        expect(action.top - chips.bottom).toBeCloseTo(12);
        expect(action.left).toBeCloseTo(24);
        expect(action.width).toBeLessThan(552);
        expect(height - action.bottom).toBeCloseTo(24);
    });

    it('should leave no gap for chips it does not project', async () => {
        const { harness } = await setupTest({ action: true });
        const [text, action] = await Promise.all([harness.getBox('text'), harness.getBox('action')]);

        expect(await harness.getText('chips')).toBeNull();
        expect(action.top - text.bottom).toBeCloseTo(12);
    });

    it('should not take focus', async () => {
        const { harness } = await setupTest();

        await userEvent.tab();

        await expect.element(page.getByRole('button', { name: 'Next' })).toHaveFocus();
        expect(await harness.isFocused()).toBe(false);
    });
});
