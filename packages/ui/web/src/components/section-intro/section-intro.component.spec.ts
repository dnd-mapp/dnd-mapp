import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { SectionIntroComponent } from './section-intro.component';
import { SectionIntroAlign } from './section-intro.types';
import {
    readColorToken,
    SectionIntroHarness,
    type SectionIntroPart,
    setupTestEnvironment,
} from '@critsource/ui-web/testing';

/** Makes the container wider than the measure of `tokens.css`, 720 px, so the width test can tell the two apart. */
const CONTAINER = `
    .container {
        width: 800px;
    }
`;

/**
 * How each part draws its text, as Penpot draws it, apart from its alignment, in the colors of the theme the test runs
 * in.
 */
function readLooks(): Record<SectionIntroPart, { color: string; fontWeight: string; textTransform: string }> {
    return {
        eyebrow: { color: readColorToken('--color-accent-text'), fontWeight: '600', textTransform: 'uppercase' },
        heading: { color: readColorToken('--color-foreground-default'), fontWeight: '800', textTransform: 'none' },
        intro: { color: readColorToken('--color-foreground-muted'), fontWeight: '400', textTransform: 'none' },
    };
}

const PARTS: SectionIntroPart[] = ['eyebrow', 'heading', 'intro'];

describe('SectionIntroComponent', () => {
    @Component({
        template: `
            <div class="container">
                <hgroup dma-section-intro [align]="align()">
                    <p>Tools</p>
                    <h3>Everything at the table</h3>
                    <p>Maps, notes, and rules in one place.</p>
                </hgroup>
            </div>
        `,
        styles: CONTAINER,
        imports: [SectionIntroComponent],
    })
    class TestComponent {
        public readonly align = signal<SectionIntroAlign>(SectionIntroAlign.Start);
    }

    @Component({
        template: `
            <div class="container">
                <hgroup dma-section-intro><h2>Everything at the table</h2></hgroup>
            </div>
        `,
        styles: CONTAINER,
        imports: [SectionIntroComponent],
    })
    class HeadingOnlyTestComponent {}

    async function setupTest(options: { align?: SectionIntroAlign } = {}) {
        const { fixture, harness } = await setupTestEnvironment({ host: TestComponent, harness: SectionIntroHarness });

        if (options.align) {
            fixture.componentInstance.align.set(options.align);
        }
        TestBed.tick();

        return { harness };
    }

    it('should project the eyebrow, the heading, and the intro text', async () => {
        const { harness } = await setupTest();

        expect(await harness.getText('eyebrow')).toBe('Tools');
        expect(await harness.getText('heading')).toBe('Everything at the table');
        expect(await harness.getText('intro')).toBe('Maps, notes, and rules in one place.');
    });

    it('should keep the heading at the level its consumer picks, named by its own text only', async () => {
        await setupTest();

        await expect
            .element(page.getByRole('heading', { level: 3, name: 'Everything at the table', exact: true }))
            .toBeInTheDocument();
    });

    it('should leave the eyebrow and the intro text as paragraphs around the heading', async () => {
        await setupTest();
        const paragraphs = page.getByRole('paragraph');

        await expect.element(paragraphs.nth(0)).toHaveTextContent('Tools');
        await expect.element(paragraphs.nth(1)).toHaveTextContent('Maps, notes, and rules in one place.');
    });

    it('should draw each part with its own color and typography', async () => {
        const { harness } = await setupTest();

        const looks = readLooks();

        for (const part of PARTS) {
            expect(await harness.getLook(part)).toEqual({ ...looks[part], textAlign: 'start' });
        }
    });

    it.each([SectionIntroAlign.Start, SectionIntroAlign.Center])('should align every part to the %s', async (align) => {
        const { harness } = await setupTest({ align });

        for (const part of PARTS) {
            expect((await harness.getLook(part)).textAlign).toBe(align);
        }
    });

    it('should align to the start for an unknown alignment', async () => {
        const { harness } = await setupTest({ align: 'end' as SectionIntroAlign });

        expect((await harness.getLook('heading')).textAlign).toBe('start');
    });

    it('should space the parts 12 px apart, with no margins of their own', async () => {
        const { harness } = await setupTest();
        const [eyebrow, heading, intro] = await Promise.all([
            harness.getBox('eyebrow'),
            harness.getBox('heading'),
            harness.getBox('intro'),
        ]);

        expect(eyebrow.top).toBe(0);
        expect(heading.top - eyebrow.bottom).toBeCloseTo(12);
        expect(intro.top - heading.bottom).toBeCloseTo(12);
    });

    it('should fill its container up to the measure', async () => {
        const { harness } = await setupTest();

        expect(await harness.getWidth()).toBe(720);
    });

    it('should draw a heading without an eyebrow or intro text', async () => {
        const { harness } = await setupTestEnvironment({
            host: HeadingOnlyTestComponent,
            harness: SectionIntroHarness,
        });

        expect(await harness.getText('eyebrow')).toBeNull();
        expect(await harness.getText('intro')).toBeNull();
        expect(await harness.getLook('heading')).toEqual({ ...readLooks().heading, textAlign: 'start' });
    });
});
