import { Component, signal, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { SectionIntroComponent } from './section-intro.component';
import { SectionIntroAlign } from './section-intro.types';
import { SectionIntroHarness, type SectionIntroPart, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

// Colors that no theme uses, so each part can only take its color from the token the test sets it on.
const ACCENT_TEXT = 'rgb(200, 30, 40)';
const FOREGROUND_DEFAULT = 'rgb(240, 230, 220)';
const FOREGROUND_MUTED = 'rgb(170, 180, 190)';

/**
 * Sets the semantic tokens that the section intro reads to values of the test, rather than loading `tokens.css`, so
 * each expectation names the token it comes from. The container is wider than the measure, so the width test can
 * tell the two apart.
 */
const TOKENS = `
    .tokens {
        --color-accent-text: ${ACCENT_TEXT};
        --color-foreground-default: ${FOREGROUND_DEFAULT};
        --color-foreground-muted: ${FOREGROUND_MUTED};
        --size-measure: 400px;
        --space-12: 12px;
        --typography-eyebrow-font-weight: 600;
        --typography-eyebrow-text-case: uppercase;
        --typography-h2-font-weight: 800;
        --typography-h2-text-case: none;
        --typography-intro-font-weight: 400;
        --typography-intro-text-case: none;
        width: 600px;
    }
`;

/** How each part draws its text, as Penpot draws it, apart from its alignment. */
const LOOKS: Record<SectionIntroPart, { color: string; fontWeight: string; textTransform: string }> = {
    eyebrow: { color: ACCENT_TEXT, fontWeight: '600', textTransform: 'uppercase' },
    heading: { color: FOREGROUND_DEFAULT, fontWeight: '800', textTransform: 'none' },
    intro: { color: FOREGROUND_MUTED, fontWeight: '400', textTransform: 'none' },
};

const PARTS = Object.keys(LOOKS) as SectionIntroPart[];

describe('SectionIntroComponent', () => {
    @Component({
        template: `
            <div class="tokens">
                <hgroup dma-section-intro [align]="align()">
                    <p>Tools</p>
                    <h3>Everything at the table</h3>
                    <p>Maps, notes, and rules in one place.</p>
                </hgroup>
            </div>
        `,
        styles: TOKENS,
        imports: [SectionIntroComponent],
    })
    class TestComponent {
        public readonly align = signal<SectionIntroAlign>(SectionIntroAlign.Start);
    }

    @Component({
        template: `
            <div class="tokens">
                <hgroup dma-section-intro><h2>Everything at the table</h2></hgroup>
            </div>
        `,
        styles: TOKENS,
        imports: [SectionIntroComponent],
    })
    class HeadingOnlyTestComponent {}

    async function setupTest(options: { host?: Type<unknown>; align?: SectionIntroAlign } = {}) {
        const { fixture, harness } = await setupTestEnvironment({
            host: options.host ?? TestComponent,
            harness: SectionIntroHarness,
        });

        if (options.align) {
            (fixture.componentInstance as TestComponent).align.set(options.align);
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

        for (const part of PARTS) {
            expect(await harness.getLook(part)).toEqual({ ...LOOKS[part], textAlign: 'start' });
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

        expect(await harness.getWidth()).toBe(400);
    });

    it('should draw a heading without an eyebrow or intro text', async () => {
        const { harness } = await setupTest({ host: HeadingOnlyTestComponent });

        expect(await harness.getText('eyebrow')).toBeNull();
        expect(await harness.getText('intro')).toBeNull();
        expect(await harness.getLook('heading')).toEqual({ ...LOOKS.heading, textAlign: 'start' });
    });
});
