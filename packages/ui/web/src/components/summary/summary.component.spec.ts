import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { SummaryComponent } from './summary.component';
import { SummaryTitleComponent } from './summary-title.component';
import { readColorToken, setupTestEnvironment, SummaryHarness } from '@dnd-mapp/ui-web/testing';

describe('SummaryComponent', () => {
    @Component({
        template: `
            <div [style.width.px]="width()">
                <section dma-summary>
                    <h2 dma-summary-title>In short</h2>
                    <ul role="list">
                        <li>No accounts, no cookies, no analytics, and no ads.</li>
                        <li>Your theme choice stays in your browser and never reaches us.</li>
                    </ul>
                </section>
            </div>
        `,
        imports: [SummaryComponent, SummaryTitleComponent],
    })
    class TestComponent {
        public readonly width = signal(600);
    }

    /** Summaries whose titles generate their ids, and one whose title has an id of the consumer. */
    @Component({
        template: `
            <section dma-summary><h2 dma-summary-title>In short</h2></section>
            <section dma-summary><h2 dma-summary-title>At a glance</h2></section>
            <section dma-summary><h2 dma-summary-title id="privacy-summary">Your data</h2></section>
        `,
        imports: [SummaryComponent, SummaryTitleComponent],
    })
    class LabelsTestComponent {}

    @Component({
        template: `<section dma-summary>
            <ul>
                <li>No accounts and no ads.</li>
            </ul>
        </section>`,
        imports: [SummaryComponent],
    })
    class NoTitleTestComponent {}

    async function setupTest(options: { width?: number } = {}) {
        const { fixture, harness } = await setupTestEnvironment({ host: TestComponent, harness: SummaryHarness });

        if (options.width) {
            fixture.componentInstance.width.set(options.width);
        }
        TestBed.tick();

        return { harness };
    }

    /** The id of each title and the `aria-labelledby` of each section, in the order of `LabelsTestComponent`. */
    async function setupLabelsTest() {
        const { harnessLoader } = await setupTestEnvironment({ host: LabelsTestComponent, harness: SummaryHarness });

        TestBed.tick();
        const summaries = await harnessLoader.getAllHarnesses(SummaryHarness);

        return await Promise.all(
            summaries.map(async (summary) => ({
                id: await summary.getTitleId(),
                label: await summary.getLabelledBy(),
            })),
        );
    }

    it('should project the title and the points', async () => {
        const { harness } = await setupTest();

        expect(await harness.getTitle()).toBe('In short');
        expect(await harness.getPoints()).toEqual([
            'No accounts, no cookies, no analytics, and no ads.',
            'Your theme choice stays in your browser and never reaches us.',
        ]);
    });

    it('should keep the points a list, through the role that the consumer sets', async () => {
        await setupTest();

        const list = page.getByRole('list');

        expect(list.getByRole('listitem').elements()).toHaveLength(2);
    });

    it('should keep the title at the level its consumer picks', async () => {
        await setupTest();

        await expect.element(page.getByRole('heading', { level: 2, name: 'In short' })).toBeInTheDocument();
    });

    it('should name each section by its title, through an id of its own', async () => {
        const [inShort, atAGlance] = await setupLabelsTest();

        expect(inShort?.id).toMatch(/^dma-summary-title-\d+$/);
        expect(atAGlance?.id).toMatch(/^dma-summary-title-\d+$/);
        expect(atAGlance?.id).not.toBe(inShort?.id);
        await expect.element(page.getByRole('region', { name: 'In short' })).toBeInTheDocument();
        await expect.element(page.getByRole('region', { name: 'At a glance' })).toBeInTheDocument();
    });

    it('should keep an id that the consumer sets on the title', async () => {
        const [, , yourData] = await setupLabelsTest();

        expect(yourData).toEqual({ id: 'privacy-summary', label: 'privacy-summary' });
        await expect.element(page.getByRole('region', { name: 'Your data' })).toBeInTheDocument();
    });

    it('should throw when the summary has no title', () => {
        setupTestEnvironment();
        const fixture = TestBed.createComponent(NoTitleTestComponent);

        expect(() => {
            fixture.detectChanges();
        }).toThrow(/NG0951/);
    });

    it('should draw the surface background with a divider border, in the colors of the theme', async () => {
        const { harness } = await setupTest();

        expect(await harness.getLook()).toEqual({
            background: readColorToken('--color-background-surface'),
            borderColor: readColorToken('--color-border-divider'),
            borderWidth: '1px',
            borderRadius: '12px',
        });
    });

    it('should draw the title in the title typography', async () => {
        const { harness } = await setupTest();

        expect(await harness.getTitleLook()).toEqual({
            color: readColorToken('--color-foreground-default'),
            fontWeight: '800',
            textTransform: 'none',
        });
    });

    it('should pad its content 24 px inside the border, and space the points 12 px below the title', async () => {
        const { harness } = await setupTest();
        const [title, points] = await Promise.all([harness.getBox('title'), harness.getBox('points')]);

        expect(title).toMatchObject({ top: 24, left: 24, width: 552 });
        expect(points.top - title.bottom).toBeCloseTo(12);
        expect(points.width).toBe(552);
    });

    it('should draw each point in the body typography, after a muted marker 12 px before it', async () => {
        await setupTest();
        const point = page.getByRole('listitem').first().element();
        const marker = getComputedStyle(point, '::before');

        expect(getComputedStyle(point)).toMatchObject({
            color: readColorToken('--color-foreground-default'),
            fontSize: '16px',
            fontWeight: '400',
        });
        expect(marker).toMatchObject({
            content: '"•" / ""',
            color: readColorToken('--color-foreground-muted'),
            paddingInlineEnd: '12px',
        });
    });

    it('should space the points 8 px apart', async () => {
        const { harness } = await setupTest();
        const [first, second] = await harness.getPointBoxes();

        expect((second?.top ?? 0) - (first?.bottom ?? 0)).toBeCloseTo(8);
    });

    /** The left edge of each point, and of each line of its text, in pixels. */
    function readPointLines() {
        return page
            .getByRole('listitem')
            .elements()
            .map((point) => {
                const range = document.createRange();

                range.selectNodeContents(point);
                return {
                    start: point.getBoundingClientRect().left,
                    lines: Array.from(range.getClientRects(), (line) => line.left),
                };
            });
    }

    it('should start the text of every point at the same place, after its marker', async () => {
        await setupTest();
        const [first, second] = readPointLines();

        expect(second?.lines[0]).toBeCloseTo(first?.lines[0] ?? 0);
        expect((first?.lines[0] ?? 0) - (first?.start ?? 0)).toBeGreaterThan(12);
    });

    it('should start each wrapped line of a point under its text, not under its marker', async () => {
        await setupTest({ width: 360 });
        const [, wrapped] = readPointLines();

        expect(wrapped?.lines).toHaveLength(2);
        expect(wrapped?.lines[1]).toBeCloseTo(wrapped?.lines[0] ?? 0);
    });

    it.each([
        [360, 360],
        [1000, 720],
    ])('should fill a container %i px wide up to the measure, at %i px', async (container, width) => {
        const { harness } = await setupTest({ width: container });

        expect(await harness.getWidth()).toBe(width);
    });
});
