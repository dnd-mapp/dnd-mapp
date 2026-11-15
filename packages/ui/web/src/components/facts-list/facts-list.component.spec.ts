import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { FactsListComponent } from './facts-list.component';
import { FactsListHarness, type FactsListLook, readColorToken, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

/**
 * The width of `.container`, which the facts list fills. Angular reads `styles` while it compiles, so the styles of
 * the host repeat the value rather than interpolate it.
 */
const CONTAINER_WIDTH = 360;

/** How each part draws its text, as Penpot draws it in both layouts, in the colors of the theme the test runs in. */
function readLooks(): Record<'term' | 'value', FactsListLook> {
    return {
        term: { color: readColorToken('--color-foreground-muted'), fontWeight: '600', textTransform: 'uppercase' },
        value: { color: readColorToken('--color-foreground-default'), fontWeight: '400', textTransform: 'none' },
    };
}

describe('FactsListComponent', () => {
    @Component({
        template: `
            <div class="container">
                <dl dma-facts-list>
                    <div>
                        <dt>Standard</dt>
                        <dd>WCAG 2.2, level AA</dd>
                    </div>
                    <div>
                        <dt>Method</dt>
                        <dd>
                            Our own checks; no outside audit yet, though one is planned for the first public release
                        </dd>
                    </div>
                </dl>
            </div>
        `,
        styles: `
            .container {
                width: 360px;
            }
        `,
        imports: [FactsListComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({ host: TestComponent, harness: FactsListHarness });

        TestBed.tick();

        return { harness };
    }

    it('should project each pair of a term and a value', async () => {
        const { harness } = await setupTest();

        expect(await harness.getFacts()).toEqual([
            { term: 'Standard', value: 'WCAG 2.2, level AA' },
            {
                term: 'Method',
                value: 'Our own checks; no outside audit yet, though one is planned for the first public release',
            },
        ]);
    });

    it('should leave each term and value to assistive technology as a term and its definition', async () => {
        await setupTest();
        const terms = page.getByRole('term');
        const definitions = page.getByRole('definition');

        await expect.element(terms.nth(0)).toHaveTextContent('Standard');
        await expect.element(definitions.nth(0)).toHaveTextContent('WCAG 2.2, level AA');
        await expect.element(terms.nth(1)).toHaveTextContent('Method');
        await expect
            .element(definitions.nth(1))
            .toHaveTextContent(
                'Our own checks; no outside audit yet, though one is planned for the first public release',
            );
    });

    it('should draw each term and value with its own color and typography', async () => {
        const { harness } = await setupTest();

        const looks = readLooks();

        for (const index of [0, 1]) {
            expect(await harness.getLook(index, 'term')).toEqual(looks.term);
            expect(await harness.getLook(index, 'value')).toEqual(looks.value);
        }
    });

    it('should fill its container, with no margins of its own', async () => {
        const { harness } = await setupTest();

        expect(await harness.getWidth()).toBe(CONTAINER_WIDTH);
        expect((await harness.getBox(0, 'term')).top).toBe(0);
    });

    describe('on narrow screens', () => {
        it('should stack each term 4 px above its value, which fills the list', async () => {
            const { harness } = await setupTest();

            for (const index of [0, 1]) {
                const [term, value] = await Promise.all([
                    harness.getBox(index, 'term'),
                    harness.getBox(index, 'value'),
                ]);

                expect(term.left).toBe(0);
                expect(term.width).toBeLessThan(CONTAINER_WIDTH);
                expect(value.left).toBe(0);
                expect(value.width).toBe(CONTAINER_WIDTH);
                expect(value.top - (term.top + term.height)).toBeCloseTo(4);
            }
        });

        it('should space the facts 12 px apart', async () => {
            const { harness } = await setupTest();
            const [firstValue, secondTerm] = await Promise.all([harness.getBox(0, 'value'), harness.getBox(1, 'term')]);

            expect(secondTerm.top - (firstValue.top + firstValue.height)).toBeCloseTo(12);
        });
    });

    describe('on wide screens', () => {
        const { innerWidth, innerHeight } = window;

        beforeEach(async () => {
            await page.viewport(1280, 800);
        });

        afterEach(async () => {
            await page.viewport(innerWidth, innerHeight);
        });

        it('should put each term in a 140 px column, 16 px before its value', async () => {
            const { harness } = await setupTest();

            for (const index of [0, 1]) {
                const [term, value] = await Promise.all([
                    harness.getBox(index, 'term'),
                    harness.getBox(index, 'value'),
                ]);

                expect(term.left).toBe(0);
                expect(term.width).toBe(140);
                expect(value.left).toBe(156);
                expect(value.width).toBe(CONTAINER_WIDTH - 156);
                expect(value.top).toBe(term.top);
            }
        });

        it('should wrap a long value within its own column', async () => {
            const { harness } = await setupTest();
            const [term, value] = await Promise.all([harness.getBox(1, 'term'), harness.getBox(1, 'value')]);

            expect(value.height).toBeGreaterThan(term.height * 2);
            expect(term.width).toBe(140);
        });

        it('should space the facts 12 px apart', async () => {
            const { harness } = await setupTest();
            const [firstValue, secondValue] = await Promise.all([
                harness.getBox(0, 'value'),
                harness.getBox(1, 'value'),
            ]);

            expect(secondValue.top - (firstValue.top + firstValue.height)).toBeCloseTo(12);
        });
    });
});
