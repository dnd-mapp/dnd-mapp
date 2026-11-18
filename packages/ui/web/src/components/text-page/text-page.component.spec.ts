import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { TextPageComponent } from './text-page.component';
import { readColorToken, type TextPageBox, TextPageHarness, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

/** The tag names of the prose of `TestComponent`, in order. */
const PROSE_TAGS = ['h2', 'p', 'p', 'h3', 'p', 'h2', 'p'];

describe('TextPageComponent', () => {
    @Component({
        template: `
            <div [style.width.px]="width()">
                <article dma-text-page>
                    <header>
                        <h1>Privacy</h1>
                        <p>Last updated <time datetime="2026-11-11">November 11, 2026</time></p>
                    </header>
                    <h2>Who is responsible</h2>
                    <p>D&amp;D Mapp is an open-source project, run by its maintainers.</p>
                    <p>Questions about your data go to the support address.</p>
                    <h3>Contact</h3>
                    <p>Write to the support address.</p>
                    <h2>Your rights</h2>
                    <p>You may ask what we hold about you.</p>
                </article>
            </div>
        `,
        imports: [TextPageComponent],
    })
    class TestComponent {
        public readonly width = signal(1000);
    }

    /** A text page that writes its prose before its header. */
    @Component({
        template: `
            <article dma-text-page>
                <h2>Who is responsible</h2>
                <header>
                    <h1>Privacy</h1>
                    <p>Last updated <time datetime="2026-11-11">November 11, 2026</time></p>
                </header>
            </article>
        `,
        imports: [TextPageComponent],
    })
    class HeaderLastTestComponent {}

    async function setupTest(options: { width?: number } = {}) {
        const { fixture, harness } = await setupTestEnvironment({ host: TestComponent, harness: TextPageHarness });

        if (options.width) {
            fixture.componentInstance.width.set(options.width);
        }
        TestBed.tick();

        return { harness };
    }

    /** The box of each element of the prose of `TestComponent`, in order. */
    async function getProseBoxes(harness: TextPageHarness): Promise<TextPageBox[]> {
        const boxes = await harness.getProseBoxes();

        expect(boxes).toHaveLength(PROSE_TAGS.length);
        return boxes;
    }

    const { innerWidth, innerHeight } = window;

    afterEach(async () => {
        await page.viewport(innerWidth, innerHeight);
    });

    it('should project the title, the date, and the prose', async () => {
        const { harness } = await setupTest();

        expect(await harness.getText('title')).toBe('Privacy');
        expect(await harness.getText('date')).toBe('Last updated November 11, 2026');
        expect(await harness.getDateTime()).toBe('2026-11-11');
        expect((await harness.getProse()).map(({ tag }) => tag)).toEqual(PROSE_TAGS);
    });

    it('should keep the headings at the levels the page writes', async () => {
        await setupTest();

        await expect.element(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeInTheDocument();
        await expect.element(page.getByRole('heading', { level: 2, name: 'Your rights' })).toBeInTheDocument();
        await expect.element(page.getByRole('heading', { level: 3, name: 'Contact' })).toBeInTheDocument();
    });

    it('should draw the header above the prose, whatever order the page writes them in', async () => {
        const { harness } = await setupTestEnvironment({ host: HeaderLastTestComponent, harness: TextPageHarness });
        const [title, prose] = await Promise.all([harness.getBox('title'), harness.getBox('prose')]);

        expect(title.top).toBe(0);
        expect(prose.top).toBeGreaterThan(title.bottom);
    });

    it('should draw the date in the small body typography, in the muted color', async () => {
        const { harness } = await setupTest();

        expect(await harness.getLook('date')).toEqual({
            color: readColorToken('--color-foreground-muted'),
            fontSize: '14px',
            fontWeight: '400',
            lineHeight: '21px',
        });
    });

    it('should draw the paragraphs in the body typography, in the default color', async () => {
        const { harness } = await setupTest();
        const [, paragraph] = await harness.getProseLooks();

        expect(paragraph).toEqual({
            color: readColorToken('--color-foreground-default'),
            fontSize: '16px',
            fontWeight: '400',
            lineHeight: '24px',
        });
    });

    it('should space the date 12 px below the title, and the prose 48 px below the date', async () => {
        const { harness } = await setupTest();
        const [title, date, prose] = await Promise.all([
            harness.getBox('title'),
            harness.getBox('date'),
            harness.getBox('prose'),
        ]);

        expect(date.top - title.bottom).toBeCloseTo(12);
        expect(prose.top - date.bottom).toBeCloseTo(48);
    });

    it('should space the prose 16 px apart, 40 px above a section and 24 px above a subsection', async () => {
        const { harness } = await setupTest();
        const [heading, first, second, subheading, third, nextHeading, last] = await getProseBoxes(harness);
        const prose = await harness.getBox('prose');

        expect(heading?.top).toBeCloseTo(prose.top);
        expect((first?.top ?? 0) - (heading?.bottom ?? 0)).toBeCloseTo(16);
        expect((second?.top ?? 0) - (first?.bottom ?? 0)).toBeCloseTo(16);
        expect((subheading?.top ?? 0) - (second?.bottom ?? 0)).toBeCloseTo(24);
        expect((third?.top ?? 0) - (subheading?.bottom ?? 0)).toBeCloseTo(16);
        expect((nextHeading?.top ?? 0) - (third?.bottom ?? 0)).toBeCloseTo(40);
        expect((last?.top ?? 0) - (nextHeading?.bottom ?? 0)).toBeCloseTo(16);
        expect(prose.bottom).toBeCloseTo(last?.bottom ?? 0);
    });

    it.each([
        [360, 360],
        [1000, 720],
    ])('should fill a container %i px wide up to the measure, at %i px', async (container, width) => {
        const { harness } = await setupTest({ width: container });

        expect(await harness.getWidth()).toBe(width);
    });

    describe('on narrow screens', () => {
        beforeEach(async () => {
            await page.viewport(375, 812);
        });

        it('should draw the title in the h1 typography at 34 px', async () => {
            const { harness } = await setupTest({ width: 335 });

            expect(await harness.getLook('title')).toEqual({
                color: readColorToken('--color-foreground-default'),
                fontSize: '34px',
                fontWeight: '800',
                lineHeight: '38.08px',
            });
        });

        it('should draw an h2 in the h3 typography at 24 px, and an h3 in the title typography', async () => {
            const { harness } = await setupTest({ width: 335 });
            const [h2, , , h3] = await harness.getProseLooks();
            const color = readColorToken('--color-foreground-default');

            expect(h2).toEqual({ color, fontSize: '24px', fontWeight: '800', lineHeight: '28.8px' });
            expect(h3).toEqual({ color, fontSize: '20px', fontWeight: '800', lineHeight: '25px' });
        });
    });

    describe('on wide screens', () => {
        beforeEach(async () => {
            await page.viewport(1600, 900);
        });

        it('should draw the title in the h1 typography at 54 px', async () => {
            const { harness } = await setupTest();

            expect(await harness.getLook('title')).toEqual({
                color: readColorToken('--color-foreground-default'),
                fontSize: '54px',
                fontWeight: '800',
                lineHeight: '60.48px',
            });
        });

        it('should draw an h2 in the h3 typography at 28 px, and an h3 in the title typography', async () => {
            const { harness } = await setupTest();
            const [h2, , , h3] = await harness.getProseLooks();
            const color = readColorToken('--color-foreground-default');

            expect(h2).toEqual({ color, fontSize: '28px', fontWeight: '800', lineHeight: '33.6px' });
            expect(h3).toEqual({ color, fontSize: '20px', fontWeight: '800', lineHeight: '25px' });
        });
    });
});
