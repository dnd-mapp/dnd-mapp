import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { OnThisPageComponent, OnThisPageLinkComponent } from '../on-this-page';
import { SummaryComponent, SummaryTitleComponent } from '../summary';
import { TextPageComponent } from './text-page.component';
import { readColorToken, type TextPageBox, TextPageHarness, setupTestEnvironment } from '@critsource/ui-web/testing';

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

    /** A text page whose prose holds a bulleted and a numbered list. */
    @Component({
        template: `
            <div [style.width.px]="width()">
                <article dma-text-page>
                    <header>
                        <h1>Privacy</h1>
                        <p>Last updated <time datetime="2026-11-11">November 11, 2026</time></p>
                    </header>
                    <p>We hold:</p>
                    <ul role="list">
                        <li>Your email address, when you write to the support address.</li>
                        <li>The theme you pick.</li>
                    </ul>
                    <p>To ask for a copy:</p>
                    <ol role="list">
                        <li>Write to the support address.</li>
                        <li>Name your account.</li>
                    </ol>
                    <h2>Your rights</h2>
                </article>
            </div>
        `,
        imports: [TextPageComponent],
    })
    class ListsTestComponent {
        public readonly width = signal(1000);
    }

    /**
     * A text page with On this page and a Summary, which it writes after the prose and in reverse order, so the test can
     * tell the order the article draws from the order the page writes. The Summary can be left out. The page leaves room
     * above the article, as the Header does, so On this page has not reached the place where it sticks.
     */
    @Component({
        template: `
            <div class="container" [style.width.px]="width()">
                <article dma-text-page>
                    <h2 id="who-is-responsible">Who is responsible</h2>
                    <p>D&amp;D Mapp is an open-source project, run by its maintainers.</p>
                    @if (summary()) {
                        <section dma-summary>
                            <h2 dma-summary-title>In short</h2>
                            <ul role="list">
                                <li>No accounts, no cookies, no analytics, and no ads.</li>
                            </ul>
                        </section>
                    }
                    <nav dma-on-this-page>
                        <li><a dma-on-this-page-link href="#who-is-responsible">Who is responsible</a></li>
                    </nav>
                    <header>
                        <h1>Privacy</h1>
                        <p>Last updated <time datetime="2026-11-11">November 11, 2026</time></p>
                    </header>
                </article>
            </div>
        `,
        styles: `
            .container {
                padding-block-start: 68px;
            }
        `,
        imports: [
            TextPageComponent,
            OnThisPageComponent,
            OnThisPageLinkComponent,
            SummaryComponent,
            SummaryTitleComponent,
        ],
    })
    class PlacedTestComponent {
        public readonly width = signal(1100);
        public readonly summary = signal(true);
    }

    /** A text page with On this page, in a page 400 px tall that scrolls within itself, so the test can scroll it. */
    @Component({
        template: `
            <div class="page">
                <article dma-text-page>
                    <header>
                        <h1>Privacy</h1>
                        <p>Last updated <time datetime="2026-11-11">November 11, 2026</time></p>
                    </header>
                    <nav dma-on-this-page>
                        <li><a dma-on-this-page-link href="#who-is-responsible">Who is responsible</a></li>
                    </nav>
                    <h2 id="who-is-responsible">Who is responsible</h2>
                    <p class="long">D&amp;D Mapp is an open-source project, run by its maintainers.</p>
                </article>
            </div>
        `,
        styles: `
            .page {
                height: 400px;
                overflow: auto;
            }

            .long {
                height: 2000px;
            }
        `,
        imports: [TextPageComponent, OnThisPageComponent, OnThisPageLinkComponent],
    })
    class ScrollingPageTestComponent {}

    async function setupTest(options: { width?: number } = {}) {
        const { fixture, harness } = await setupTestEnvironment({ host: TestComponent, harness: TextPageHarness });

        if (options.width) {
            fixture.componentInstance.width.set(options.width);
        }
        TestBed.tick();

        return { harness };
    }

    async function setupPlacedTest(options: { width?: number; summary?: boolean } = {}) {
        const { fixture, harness } = await setupTestEnvironment({
            host: PlacedTestComponent,
            harness: TextPageHarness,
        });

        if (options.width) {
            fixture.componentInstance.width.set(options.width);
        }
        fixture.componentInstance.summary.set(options.summary ?? true);
        TestBed.tick();

        return { harness };
    }

    /** The height of the article, in pixels. */
    function readArticleHeight(): number {
        return page.getByRole('article').element().getBoundingClientRect().height;
    }

    /** The box of each element of the prose of `TestComponent`, in order. */
    async function getProseBoxes(harness: TextPageHarness): Promise<TextPageBox[]> {
        const boxes = await harness.getProseBoxes();

        expect(boxes).toHaveLength(PROSE_TAGS.length);
        return boxes;
    }

    async function setupListsTest(options: { width?: number } = {}) {
        const { fixture, harness } = await setupTestEnvironment({ host: ListsTestComponent, harness: TextPageHarness });

        if (options.width) {
            fixture.componentInstance.width.set(options.width);
        }
        TestBed.tick();

        return { harness };
    }

    /** The left edge of each list item, and of each line of its text, in pixels. */
    function readItemLines() {
        return page
            .getByRole('listitem')
            .elements()
            .map((item) => {
                const range = document.createRange();

                range.selectNodeContents(item);
                return {
                    start: item.getBoundingClientRect().left,
                    lines: Array.from(range.getClientRects(), (line) => line.left),
                };
            });
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

    it('should project the lists and their items', async () => {
        const { harness } = await setupListsTest();

        expect((await harness.getProse()).map(({ tag }) => tag)).toEqual(['p', 'ul', 'p', 'ol', 'h2']);
        expect(await harness.getListItems()).toEqual([
            'Your email address, when you write to the support address.',
            'The theme you pick.',
            'Write to the support address.',
            'Name your account.',
        ]);
    });

    it('should draw each item in the body typography, after a muted marker 12 px before it', async () => {
        await setupListsTest();
        const [bullet, , number] = page.getByRole('listitem').elements();
        const muted = { color: readColorToken('--color-foreground-muted'), paddingInlineEnd: '12px' };

        expect(getComputedStyle(bullet as Element)).toMatchObject({
            color: readColorToken('--color-foreground-default'),
            fontSize: '16px',
            fontWeight: '400',
            lineHeight: '24px',
        });
        expect(getComputedStyle(bullet as Element, '::before')).toMatchObject({ content: '"•" / ""', ...muted });
        expect(getComputedStyle(number as Element, '::before')).toMatchObject({
            content: 'counter(list-item) "." / ""',
            ...muted,
        });
    });

    it('should space the items 8 px apart, and the lists 16 px from the prose around them', async () => {
        const { harness } = await setupListsTest();
        const [first, second, third, fourth] = await harness.getListItemBoxes();
        const [intro, bullets, , numbers, heading] = await harness.getProseBoxes();

        expect((second?.top ?? 0) - (first?.bottom ?? 0)).toBeCloseTo(8);
        expect((fourth?.top ?? 0) - (third?.bottom ?? 0)).toBeCloseTo(8);
        expect((bullets?.top ?? 0) - (intro?.bottom ?? 0)).toBeCloseTo(16);
        expect((heading?.top ?? 0) - (numbers?.bottom ?? 0)).toBeCloseTo(40);
    });

    it('should start the text of every item at the same place, after its marker', async () => {
        await setupListsTest();
        const [first, second] = readItemLines();

        expect(second?.lines[0]).toBeCloseTo(first?.lines[0] ?? 0);
        expect((first?.lines[0] ?? 0) - (first?.start ?? 0)).toBeGreaterThan(12);
    });

    it('should start each wrapped line of an item under its text, not under its marker', async () => {
        await setupListsTest({ width: 360 });
        const [wrapped] = readItemLines();

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

        it('should stack the header, On this page, the Summary, and the prose 48 px apart, in that order', async () => {
            const { harness } = await setupPlacedTest({ width: 335 });
            const [date, nav, summary, prose] = await Promise.all([
                harness.getBox('date'),
                harness.getBox('nav'),
                harness.getBox('summary'),
                harness.getBox('prose'),
            ]);

            expect(nav.top - date.bottom).toBeCloseTo(48);
            expect(summary.top - nav.bottom).toBeCloseTo(48);
            expect(prose.top - summary.bottom).toBeCloseTo(48);
        });

        it('should give On this page the width of the article', async () => {
            const { harness } = await setupPlacedTest({ width: 335 });

            expect(await harness.getBox('nav')).toMatchObject({ left: 0, width: 335 });
            expect(await harness.getWidth()).toBe(335);
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

        it('should place On this page in a column 240 px wide, 64 px beside the rest, at the top', async () => {
            const { harness } = await setupPlacedTest();
            const [title, nav, summary, prose] = await Promise.all([
                harness.getBox('title'),
                harness.getBox('nav'),
                harness.getBox('summary'),
                harness.getBox('prose'),
            ]);

            expect(nav).toMatchObject({ top: 0, left: 720 + 64, width: 240 });
            expect(title).toMatchObject({ top: 0, left: 0, width: 720 });
            expect(summary).toMatchObject({ left: 0, width: 720 });
            expect(prose).toMatchObject({ left: 0, width: 720 });
        });

        it('should grow the article by the column of On this page, to 1024 px', async () => {
            const { harness } = await setupPlacedTest();

            expect(await harness.getWidth()).toBe(1024);
        });

        it('should keep the article at the measure without On this page', async () => {
            const { harness } = await setupTest({ width: 1100 });

            expect(await harness.getWidth()).toBe(720);
        });

        it('should stack the header, the Summary, and the prose 48 px apart beside On this page', async () => {
            const { harness } = await setupPlacedTest();
            const [date, summary, prose] = await Promise.all([
                harness.getBox('date'),
                harness.getBox('summary'),
                harness.getBox('prose'),
            ]);

            expect(summary.top - date.bottom).toBeCloseTo(48);
            expect(prose.top - summary.bottom).toBeCloseTo(48);
            expect(readArticleHeight()).toBeCloseTo(prose.bottom);
        });

        it('should end the article at the end of the prose without a Summary', async () => {
            const { harness } = await setupPlacedTest({ summary: false });
            const [date, prose] = await Promise.all([harness.getBox('date'), harness.getBox('prose')]);

            expect(prose.top - date.bottom).toBeCloseTo(48);
            expect(readArticleHeight()).toBeCloseTo(prose.bottom);
        });

        it('should keep On this page 24 px below the top of the page while the article scrolls past', async () => {
            const { harness } = await setupTestEnvironment({
                host: ScrollingPageTestComponent,
                harness: TextPageHarness,
            });
            const scroller = page.getByRole('article').element().parentElement;

            scroller?.scrollTo({ top: 1000 });
            const [nav, article] = await Promise.all([
                harness.getBox('nav'),
                Promise.resolve(page.getByRole('article').element().getBoundingClientRect()),
            ]);

            expect(article.top + nav.top - (scroller?.getBoundingClientRect().top ?? 0)).toBeCloseTo(24);
        });
    });
});
