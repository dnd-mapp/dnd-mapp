import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { SectionComponent } from './section.component';
import { SectionIntroComponent } from '../section-intro';
import { readColorToken, type SectionBox, SectionHarness, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

describe('SectionComponent', () => {
    @Component({
        template: `
            <div [style.width.px]="width()">
                <section dma-section>
                    <hgroup dma-section-intro>
                        <p>Tools</p>
                        <h2>Everything at the table</h2>
                        <p>Maps, notes, and rules in one place.</p>
                    </hgroup>
                    <p>The content of the section.</p>
                </section>
            </div>
        `,
        imports: [SectionComponent, SectionIntroComponent],
    })
    class TestComponent {
        public readonly width = signal(1440);
    }

    async function setupTest(options: { width?: number } = {}) {
        const { fixture, harness } = await setupTestEnvironment({ host: TestComponent, harness: SectionHarness });

        if (options.width) {
            fixture.componentInstance.width.set(options.width);
        }
        TestBed.tick();

        return { harness };
    }

    /** The intro and the paragraph that the host projects, in that order. */
    async function getChildBoxes(harness: SectionHarness): Promise<[SectionBox, SectionBox]> {
        const boxes = await harness.getChildBoxes();

        expect(boxes).toHaveLength(2);
        return boxes as [SectionBox, SectionBox];
    }

    const { innerWidth, innerHeight } = window;

    afterEach(async () => {
        await page.viewport(innerWidth, innerHeight);
    });

    it('should project its content', async () => {
        const { harness } = await setupTest();
        const text = await harness.getText();

        expect(text).toContain('Everything at the table');
        expect(text).toContain('The content of the section.');
    });

    it('should fill itself with the page background', async () => {
        const { harness } = await setupTest();

        expect((await harness.getLook()).background).toBe(readColorToken('--color-background-page'));
    });

    describe('on narrow screens', () => {
        beforeEach(async () => {
            await page.viewport(375, 812);
        });

        it('should pad itself 56 px above and below, and 20 px at the sides', async () => {
            const { harness } = await setupTest({ width: 375 });

            expect((await harness.getLook()).padding).toBe('56px 20px');
        });

        it('should stack its children 28 px apart, each across the content', async () => {
            const { harness } = await setupTest({ width: 375 });
            const [content, [intro, text], { height }] = await Promise.all([
                harness.getContentBox(),
                getChildBoxes(harness),
                harness.getSize(),
            ]);

            expect(content.left).toBe(20);
            expect(content.width).toBe(335);
            expect(intro.top).toBe(56);
            expect(text.top - intro.bottom).toBeCloseTo(28);
            expect(height - text.bottom).toBeCloseTo(56);
            expect(intro.width).toBe(335);
            expect(text.width).toBe(335);
        });
    });

    describe('on wide screens', () => {
        beforeEach(async () => {
            await page.viewport(1600, 900);
        });

        it('should pad itself 96 px above and below, and 120 px at the sides', async () => {
            const { harness } = await setupTest();

            expect((await harness.getLook()).padding).toBe('96px 120px');
        });

        it('should stack its children 40 px apart, with the intro at its own width', async () => {
            const { harness } = await setupTest();
            const [content, [intro, text], { height }] = await Promise.all([
                harness.getContentBox(),
                getChildBoxes(harness),
                harness.getSize(),
            ]);

            expect(content.left).toBe(120);
            expect(content.width).toBe(1200);
            expect(intro.top).toBe(96);
            expect(text.top - intro.bottom).toBeCloseTo(40);
            expect(height - text.bottom).toBeCloseTo(96);
            expect(intro.left).toBe(120);
            expect(intro.width).toBe(720);
            expect(text.width).toBe(1200);
        });

        it('should keep its content 1200 px wide, centered, in a wider container', async () => {
            const { harness } = await setupTest({ width: 1500 });
            const content = await harness.getContentBox();

            expect(content.width).toBe(1200);
            expect(content.left).toBe(150);
        });

        it('should fill a narrower container with its content, inside its padding', async () => {
            const { harness } = await setupTest({ width: 1100 });
            const content = await harness.getContentBox();

            expect(content.width).toBe(860);
            expect(content.left).toBe(120);
        });
    });
});
