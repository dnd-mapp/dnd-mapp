import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { TextPageComponent } from './text-page.component';
import { readColorToken, TextPageHarness, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

describe('TextPageComponent', () => {
    @Component({
        template: `
            <div [style.width.px]="width()">
                <article dma-text-page>
                    <header>
                        <h1>Privacy</h1>
                        <p>Last updated <time datetime="2026-11-11">November 11, 2026</time></p>
                    </header>
                    <p>The prose of the page.</p>
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
                <p>The prose of the page.</p>
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

    const { innerWidth, innerHeight } = window;

    afterEach(async () => {
        await page.viewport(innerWidth, innerHeight);
    });

    it('should project the title, the date, and the prose', async () => {
        const { harness } = await setupTest();

        expect(await harness.getText('title')).toBe('Privacy');
        expect(await harness.getText('date')).toBe('Last updated November 11, 2026');
        expect(await harness.getDateTime()).toBe('2026-11-11');
        await expect.element(page.getByText('The prose of the page.')).toBeInTheDocument();
    });

    it('should keep the title a heading of level 1', async () => {
        await setupTest();

        await expect.element(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeInTheDocument();
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

    it.each([
        [360, 360],
        [1000, 720],
    ])('should fill a container %i px wide up to the measure, at %i px', async (container, width) => {
        const { harness } = await setupTest({ width: container });

        expect(await harness.getWidth()).toBe(width);
    });

    it.each([
        ['34px', 375, 812, '38.08px'],
        ['54px', 1600, 900, '60.48px'],
    ])(
        'should draw the title in the h1 typography, at %s, in a viewport %i px wide',
        async (fontSize, viewportWidth, viewportHeight, lineHeight) => {
            await page.viewport(viewportWidth, viewportHeight);
            const { harness } = await setupTest({ width: 335 });

            expect(await harness.getLook('title')).toEqual({
                color: readColorToken('--color-foreground-default'),
                fontSize,
                fontWeight: '800',
                lineHeight,
            });
        },
    );
});
