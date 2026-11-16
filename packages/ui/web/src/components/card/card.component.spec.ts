import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page, userEvent } from 'vitest/browser';
import { CardComponent } from './card.component';
import { CardHarness, type CardPartLook, readColorToken, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

/** How each part draws its text, as Penpot draws it, in the colors of the theme the test runs in. */
function readPartLooks(): Record<'title' | 'text', CardPartLook> {
    return {
        title: { color: readColorToken('--color-foreground-default'), fontWeight: '800', textTransform: 'none' },
        text: { color: readColorToken('--color-foreground-muted'), fontWeight: '400', textTransform: 'none' },
    };
}

describe('CardComponent', () => {
    @Component({
        template: `
            <div [style.width.px]="width()">
                <dma-card>
                    <h3>Characters</h3>
                    <p>Build character sheets and keep their spell books.</p>
                </dma-card>
            </div>
            <button type="button">Next</button>
        `,
        imports: [CardComponent],
    })
    class TestComponent {
        public readonly width = signal(600);
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

    async function setupTest(options: { width?: number } = {}) {
        const { fixture, harness } = await setupTestEnvironment({ host: TestComponent, harness: CardHarness });

        if (options.width) {
            fixture.componentInstance.width.set(options.width);
        }
        TestBed.tick();

        return { harness };
    }

    it('should project the title and the text', async () => {
        const { harness } = await setupTest();

        expect(await harness.getText('title')).toBe('Characters');
        expect(await harness.getText('text')).toBe('Build character sheets and keep their spell books.');
    });

    it('should keep the title at the level its consumer picks, named by its own text only', async () => {
        await setupTest();

        await expect
            .element(page.getByRole('heading', { level: 3, name: 'Characters', exact: true }))
            .toBeInTheDocument();
    });

    it('should draw the surface background with a divider border', async () => {
        const { harness } = await setupTest();

        expect(await harness.getLook()).toEqual({
            background: readColorToken('--color-background-surface'),
            borderColor: readColorToken('--color-border-divider'),
            borderWidth: '1px',
            borderRadius: '12px',
        });
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

    it('should not take focus', async () => {
        const { harness } = await setupTest();

        await userEvent.tab();

        await expect.element(page.getByRole('button', { name: 'Next' })).toHaveFocus();
        expect(await harness.isFocused()).toBe(false);
    });
});
