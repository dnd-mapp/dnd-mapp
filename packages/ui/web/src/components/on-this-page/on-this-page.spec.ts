import { Component, signal, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page, userEvent } from 'vitest/browser';
import { OnThisPageLinkComponent } from './on-this-page-link.component';
import { OnThisPageComponent } from './on-this-page.component';
import {
    OnThisPageHarness,
    OnThisPageLinkHarness,
    type OnThisPageLinkLook,
    readColorToken,
    setupTestEnvironment,
} from '@dnd-mapp/ui-web/testing';

const TRANSPARENT = 'rgba(0, 0, 0, 0)';

/**
 * The width of `.container`, the 240 px column of Penpot, so the width test can tell filling it from fitting the label.
 * Angular reads `styles` while it compiles, so they repeat the value rather than interpolate it.
 */
const CONTAINER_WIDTH = 240;

/** The height of a label on one line: the 14 px of `typography.body-sm` at a line height of 1.5. */
const LABEL_HEIGHT = 21;

/**
 * How the link looks in each state, as Penpot draws it, in the colors of the theme the test runs in. Focus keeps the
 * look of the state it adds to, and Penpot draws no hovered current link, which keeps the accent color.
 */
function readLooks(): Record<'default' | 'hover' | 'current', OnThisPageLinkLook> {
    return {
        default: { background: TRANSPARENT, color: readColorToken('--color-foreground-muted'), fontWeight: '400' },
        hover: { background: TRANSPARENT, color: readColorToken('--color-foreground-default'), fontWeight: '400' },
        current: { background: TRANSPARENT, color: readColorToken('--color-accent-text'), fontWeight: '400' },
    };
}

describe('OnThisPageLinkComponent', () => {
    @Component({
        template: `
            <div class="container">
                <a dma-on-this-page-link [attr.aria-current]="current() ? 'location' : null" href="#your-rights">
                    Your rights
                </a>
            </div>
        `,
        styles: `
            .container {
                width: 240px;
                padding: 1rem;
            }
        `,
        imports: [OnThisPageLinkComponent],
    })
    class TestComponent {
        public readonly current = signal(false);
    }

    async function setupTest(current = false) {
        const { fixture, harness } = await setupTestEnvironment({
            host: TestComponent,
            harness: OnThisPageLinkHarness,
        });

        fixture.componentInstance.current.set(current);
        TestBed.tick();

        return { harness, link: page.getByRole('link', { name: 'Your rights', exact: true }) };
    }

    /** Expects the 2 px indicator with rounded ends at the start of the link, as tall as its label, in `token`. */
    async function expectIndicator(harness: OnThisPageLinkHarness, token: `--color-${string}`) {
        expect(await harness.getIndicator()).toEqual({
            color: readColorToken(token),
            borderRadius: '1px',
            left: 0,
            top: 8,
            width: 2,
            height: LABEL_HEIGHT,
        });
    }

    it('should be a link to its section, named by its label alone', async () => {
        const { harness, link } = await setupTest();

        await expect.element(link).toHaveAttribute('href', '#your-rights');
        expect(await harness.getText()).toBe('Your rights');
    });

    it('should draw its default look and the indicator in the divider color', async () => {
        const { harness } = await setupTest();

        expect(await harness.getLook()).toEqual(readLooks().default);
        await expectIndicator(harness, '--color-border-divider');
    });

    it('should pad its label, with rounded corners, as Penpot draws it', async () => {
        const { harness } = await setupTest();

        expect(await harness.getBox()).toEqual({
            height: 8 + LABEL_HEIGHT + 8,
            padding: '8px 16px',
            borderRadius: '8px',
        });
    });

    it('should fill its container', async () => {
        const { harness } = await setupTest();

        expect((await harness.getSize()).width).toBe(CONTAINER_WIDTH);
    });

    it('should keep the indicator as tall as a label that wraps', async () => {
        const { harness } = await setupTest();

        document.querySelector<HTMLElement>('.container')?.style.setProperty('width', '80px');
        const { height } = await harness.getSize();

        expect(height).toBe(8 + 2 * LABEL_HEIGHT + 8);
        expect((await harness.getIndicator()).height).toBe(2 * LABEL_HEIGHT);
    });

    it('should turn its label to the default color on hover, and keep the indicator', async () => {
        const { harness, link } = await setupTest();

        await userEvent.hover(link);
        const look = await harness.getLook();
        const indicator = await harness.getIndicator();
        await userEvent.unhover(link);

        expect(look).toEqual(readLooks().hover);
        expect(indicator.color).toBe(readColorToken('--color-border-divider'));
    });

    it('should draw no focus ring until it has focus', async () => {
        const { harness } = await setupTest();

        expect((await harness.getFocusRing()).style).toBe('none');
    });

    it('should draw the focus ring outside itself on keyboard focus, and keep its default look', async () => {
        const { harness, link } = await setupTest();

        await userEvent.tab();

        await expect.element(link).toHaveFocus();
        expect(await harness.getFocusRing()).toEqual({
            style: 'solid',
            color: readColorToken('--color-focus-ring'),
            width: '2px',
            offset: '2px',
        });
        expect(await harness.getLook()).toEqual(readLooks().default);
    });

    it('should mark no section by default', async () => {
        const { harness, link } = await setupTest();

        await expect.element(link).not.toHaveAttribute('aria-current');
        expect(await harness.isCurrent()).toBe(false);
    });

    describe('for the section in view', () => {
        it('should mark the section in view to assistive technology', async () => {
            const { harness, link } = await setupTest(true);

            await expect.element(link).toHaveAttribute('aria-current', 'location');
            expect(await harness.isCurrent()).toBe(true);
        });

        it('should draw its label and the indicator in the accent color', async () => {
            const { harness } = await setupTest(true);

            expect(await harness.getLook()).toEqual(readLooks().current);
            await expectIndicator(harness, '--color-accent-text');
        });

        it('should keep its current look on hover', async () => {
            const { harness, link } = await setupTest(true);

            await userEvent.hover(link);
            const look = await harness.getLook();
            const indicator = await harness.getIndicator();
            await userEvent.unhover(link);

            expect(look).toEqual(readLooks().current);
            expect(indicator.color).toBe(readColorToken('--color-accent-text'));
        });

        it('should keep its current look on keyboard focus', async () => {
            const { harness } = await setupTest(true);

            await userEvent.tab();

            expect((await harness.getFocusRing()).style).toBe('solid');
            expect(await harness.getLook()).toEqual(readLooks().current);
            await expectIndicator(harness, '--color-accent-text');
        });
    });
});

describe('OnThisPageComponent', () => {
    @Component({
        template: `
            <div class="container">
                <nav dma-on-this-page>
                    <li><a dma-on-this-page-link href="#who-is-responsible">Who is responsible</a></li>
                    <li><a dma-on-this-page-link href="#what-we-process">What we process</a></li>
                    <li><a dma-on-this-page-link href="#your-rights">Your rights</a></li>
                </nav>
            </div>
        `,
        styles: `
            .container {
                width: 300px;
            }
        `,
        imports: [OnThisPageComponent, OnThisPageLinkComponent],
    })
    class TestComponent {}

    /** Two navs on one page, such as one for each of two articles side by side. */
    @Component({
        template: `
            <nav dma-on-this-page>
                <li><a dma-on-this-page-link href="#your-rights">Your rights</a></li>
            </nav>
            <nav dma-on-this-page>
                <li><a dma-on-this-page-link href="#scope">Scope</a></li>
            </nav>
        `,
        imports: [OnThisPageComponent, OnThisPageLinkComponent],
    })
    class TwoNavsTestComponent {}

    /**
     * A page that scrolls, with the nav in a 240 px column beside a long article, as the Privacy page places it. The
     * page scrolls within itself, so the test scrolls it without scrolling the test runner.
     */
    @Component({
        template: `
            <div class="page">
                <div class="columns">
                    <nav dma-on-this-page>
                        <li><a dma-on-this-page-link href="#your-rights">Your rights</a></li>
                    </nav>
                    <article class="article"></article>
                </div>
            </div>
        `,
        styles: `
            .page {
                height: 400px;
                overflow: auto;
            }

            .columns {
                display: grid;
                grid-template-columns: 240px 1fr;
            }

            .article {
                height: 2000px;
            }
        `,
        imports: [OnThisPageComponent, OnThisPageLinkComponent],
    })
    class ScrollingPageTestComponent {}

    async function setupTest(host: Type<unknown> = TestComponent) {
        const { harness } = await setupTestEnvironment({ host, harness: OnThisPageHarness });

        return { harness };
    }

    it('should be a navigation named by its title', async () => {
        const { harness } = await setupTest();

        await expect.element(page.getByRole('navigation', { name: 'On this page', exact: true })).toBeInTheDocument();
        expect(await harness.getTitleText()).toBe('On this page');
    });

    it('should give the title of each nav an id of its own', async () => {
        await setupTest(TwoNavsTestComponent);
        const navs = page.getByRole('navigation', { name: 'On this page', exact: true });
        const [first, second] = navs.elements().map((nav) => nav.getAttribute('aria-labelledby'));

        expect(navs.elements()).toHaveLength(2);
        expect(first).not.toBe(second);
    });

    it('should project the links in their order', async () => {
        const { harness } = await setupTest();
        const links = await harness.getLinks();

        expect(await Promise.all(links.map((link) => link.getText()))).toEqual([
            'Who is responsible',
            'What we process',
            'Your rights',
        ]);
    });

    it('should render the links as a list, one link per item', async () => {
        await setupTest();
        const list = page.getByRole('navigation').getByRole('list');

        expect(list.getByRole('listitem').elements()).toHaveLength(3);
        expect(list.getByRole('link').elements()).toHaveLength(3);
        await expect.element(list.getByRole('listitem').nth(1)).toHaveTextContent('What we process');
    });

    it('should draw the title in the caps typography', async () => {
        const { harness } = await setupTest();

        expect(await harness.getTitleLook()).toEqual({
            color: readColorToken('--color-foreground-default'),
            fontWeight: '600',
            textTransform: 'uppercase',
        });
    });

    it('should space the list 12 px below the title, and stack the links with no gap', async () => {
        const { harness } = await setupTest();
        const [title, list, items] = await Promise.all([
            harness.getTitleBox(),
            harness.getListBox(),
            harness.getItemBoxes(),
        ]);
        const gaps = items.slice(1).map((item, index) => item.top - (items[index]?.bottom ?? Number.NaN));

        expect(title.top).toBe(0);
        expect(list.top - title.bottom).toBeCloseTo(12);
        expect(items[0]?.top).toBeCloseTo(list.top);
        expect(gaps).toEqual([0, 0]);
    });

    it('should fill its container, and stretch its links to its width', async () => {
        const { harness } = await setupTest();
        const links = await harness.getLinks();

        expect(await harness.getWidth()).toBe(300);
        for (const link of links) {
            expect((await link.getSize()).width).toBe(300);
        }
    });

    it('should stick 24 px below the top of the page as the article scrolls', async () => {
        const { harness } = await setupTest(ScrollingPageTestComponent);
        const scroller = document.querySelector<HTMLElement>('.page');
        const pageTop = scroller?.getBoundingClientRect().top ?? Number.NaN;

        expect(await harness.getStickiness()).toEqual({ position: 'sticky', top: '24px' });

        scroller?.scrollTo({ top: 600 });

        expect((await harness.getTop()) - pageTop).toBeCloseTo(24);
    });

    describe('as the reader scrolls', () => {
        /**
         * A long article beside the nav, which scrolls the document as the pages of the app do. Each part of the
         * article is taller than the viewport, so the test can place a heading anywhere in it. Cookies has no heading.
         */
        @Component({
            template: `
                <nav dma-on-this-page>
                    <li><a dma-on-this-page-link href="#who-is-responsible">Who is responsible</a></li>
                    <li><a dma-on-this-page-link href="#what-we-process">What we process</a></li>
                    <li><a dma-on-this-page-link href="#cookies">Cookies</a></li>
                    <li><a dma-on-this-page-link href="#your-rights">Your rights</a></li>
                </nav>
                <article>
                    <p class="part">Introduction</p>
                    <h2 id="who-is-responsible">Who is responsible</h2>
                    <p class="part">Who is responsible</p>
                    <h2 id="what-we-process">What we process</h2>
                    <p class="part">What we process</p>
                    <h2 id="your-rights">Your rights</h2>
                    <p class="part">Your rights</p>
                </article>
            `,
            styles: `
                .part {
                    height: 2000px;
                }
            `,
            imports: [OnThisPageComponent, OnThisPageLinkComponent],
        })
        class ArticleTestComponent {}

        afterEach(() => {
            vi.restoreAllMocks();
            vi.unstubAllGlobals();
        });

        /** Scrolls the document so the top of the heading of `id` sits `offset` pixels below the top of the viewport. */
        async function placeHeading(id: string, offset: number) {
            const heading = document.getElementById(id);
            const top = (heading?.getBoundingClientRect().top ?? Number.NaN) + window.scrollY - offset;

            window.scrollTo({ top, behavior: 'instant' });
            await nextFrames();
        }

        /** Waits until the browser has rendered twice and delivered what the observers noticed. */
        async function nextFrames() {
            await new Promise<void>((resolve) => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        setTimeout(resolve);
                    });
                });
            });
        }

        async function setupArticle() {
            const { fixture, harness } = await setupTestEnvironment({
                host: ArticleTestComponent,
                harness: OnThisPageHarness,
            });

            await nextFrames();

            return { fixture, harness };
        }

        it('should mark the first section before the reader reaches its heading', async () => {
            const { harness } = await setupArticle();

            expect(await harness.getCurrentLinkTexts()).toEqual(['Who is responsible']);
            await expect
                .element(page.getByRole('link', { name: 'Who is responsible' }))
                .toHaveAttribute('aria-current', 'location');
        });

        it('should mark a section once its heading reaches the top third of the viewport', async () => {
            const { harness } = await setupArticle();

            await placeHeading('what-we-process', window.innerHeight / 2);
            expect(await harness.getCurrentLinkTexts()).toEqual(['Who is responsible']);

            await placeHeading('what-we-process', window.innerHeight / 4);
            expect(await harness.getCurrentLinkTexts()).toEqual(['What we process']);
        });

        it('should keep the section marked while the reader reads the rest of it', async () => {
            const { harness } = await setupArticle();

            await placeHeading('what-we-process', -1000);

            expect(await harness.getCurrentLinkTexts()).toEqual(['What we process']);
        });

        it('should mark the section the page jumps to, in either direction', async () => {
            const { harness } = await setupArticle();

            await placeHeading('your-rights', -1000);
            expect(await harness.getCurrentLinkTexts()).toEqual(['Your rights']);

            await placeHeading('who-is-responsible', -1000);
            expect(await harness.getCurrentLinkTexts()).toEqual(['Who is responsible']);

            await placeHeading('who-is-responsible', window.innerHeight / 2);
            expect(await harness.getCurrentLinkTexts()).toEqual(['Who is responsible']);
        });

        it('should never mark a link whose heading is missing from the page', async () => {
            const { harness } = await setupArticle();

            await placeHeading('what-we-process', -1000);
            expect(await harness.getCurrentLinkTexts()).toEqual(['What we process']);

            await placeHeading('your-rights', 0);
            expect(await harness.getCurrentLinkTexts()).toEqual(['Your rights']);
            await expect.element(page.getByRole('link', { name: 'Cookies' })).not.toHaveAttribute('aria-current');
        });

        it('should stop watching the headings once the nav is destroyed', async () => {
            const disconnect = vi.spyOn(IntersectionObserver.prototype, 'disconnect');
            const { fixture } = await setupArticle();

            fixture.destroy();

            expect(disconnect).toHaveBeenCalledOnce();
        });

        it('should render on the server with no link marked, and watch no heading', async () => {
            vi.stubGlobal('ngServerMode', true);
            const observe = vi.spyOn(IntersectionObserver.prototype, 'observe');
            const { harness } = await setupArticle();

            expect(await harness.getLinks()).toHaveLength(4);
            expect(await harness.getCurrentLinkTexts()).toEqual([]);
            expect(observe).not.toHaveBeenCalled();
        });
    });
});
