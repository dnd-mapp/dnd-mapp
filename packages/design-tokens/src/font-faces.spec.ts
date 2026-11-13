import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { buildFonts, fallbackOverrides, parseFaces, type FontMetrics } from './font-faces.ts';
import { fonts, type FontFamily } from './fonts.ts';

const root = join(import.meta.dirname, '..');

// Two faces in the format of the wght.css of a Fontsource package.
const fontsourceCss = `/* source-sans-3-latin-ext-wght-normal */
@font-face {
  font-family: 'Source Sans 3 Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 200 900;
  src: url(./files/source-sans-3-latin-ext-wght-normal.woff2) format('woff2-variations');
  unicode-range: U+0100-02BA,U+02BD-02C5;
}

/* source-sans-3-latin-wght-normal */
@font-face {
  font-family: 'Source Sans 3 Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 200 900;
  src: url(./files/source-sans-3-latin-wght-normal.woff2) format('woff2-variations');
  unicode-range: U+0000-00FF,U+0131;
}
`;

/**
 * Splits the generated CSS into its `@font-face` rules.
 * @param css - The contents of `fonts.css`.
 * @returns The comment above each rule, and the declarations of the rule with Prettier's line wraps joined.
 */
function parseRules(css: string) {
    return [...css.matchAll(/\/\* ([^*]+) \*\/\n@font-face \{\n([^}]*)\}/g)].map(([, comment = '', body = '']) => ({
        comment,
        declarations: body
            .replaceAll(/\n\s{8}/g, ' ')
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line !== ''),
    }));
}

/**
 * Lists the subsets that a CSS file of a Fontsource package declares.
 * @param font - The family whose package to read.
 * @param file - The CSS file of a style, such as `wght.css`.
 * @returns The subsets, in the order of the file.
 */
async function packageSubsets(font: FontFamily, file: string) {
    const css = await readFile(join(root, 'node_modules', font.package, file), 'utf8');

    return parseFaces(css, font.package, file === 'wght.css' ? 'normal' : 'italic').map((face) => face.subset);
}

describe('parseFaces', () => {
    it('reads the subset, weight, file, and unicode-range of each face', () => {
        expect(parseFaces(fontsourceCss, '@fontsource-variable/source-sans-3', 'normal')).toEqual([
            {
                subset: 'latin-ext',
                style: 'normal',
                weight: '200 900',
                file: 'source-sans-3-latin-ext-wght-normal.woff2',
                unicodeRange: 'U+0100-02BA, U+02BD-02C5',
            },
            {
                subset: 'latin',
                style: 'normal',
                weight: '200 900',
                file: 'source-sans-3-latin-wght-normal.woff2',
                unicodeRange: 'U+0000-00FF, U+0131',
            },
        ]);
    });

    it('fails on a font file that the package names another way', () => {
        expect(() => parseFaces(fontsourceCss, '@fontsource-variable/manrope', 'normal')).toThrow(
            "@fontsource-variable/manrope names a font file source-sans-3-latin-ext-wght-normal.woff2, which isn't " +
                'manrope-<subset>-wght-normal.woff2.',
        );
    });

    it('fails on a face of another style than its file holds', () => {
        const css = fontsourceCss.replaceAll('wght-normal', 'wght-italic');

        expect(() => parseFaces(css, '@fontsource-variable/source-sans-3', 'italic')).toThrow(
            'declares source-sans-3-latin-ext-wght-italic.woff2 in the CSS of its italic style, but not as italic.',
        );
    });

    it('fails on a face without a descriptor that the build reads', () => {
        const css = fontsourceCss.replaceAll(/\s*unicode-range: [^;]+;/g, '');

        expect(() => parseFaces(css, '@fontsource-variable/source-sans-3', 'normal')).toThrow(
            '@fontsource-variable/source-sans-3 has a @font-face rule that doesn',
        );
    });
});

describe('fallbackOverrides', () => {
    // The metrics of Source Sans 3 and Arial, as @capsizecss/unpack and @capsizecss/metrics hold them.
    const sourceSans: FontMetrics = { ascent: 1024, descent: -400, lineGap: 0, unitsPerEm: 1000, xWidthAvg: 398 };
    const arial: FontMetrics = { ascent: 1854, descent: -434, lineGap: 67, unitsPerEm: 2048, xWidthAvg: 913 };

    it('scales the fallback to the average character width of the family', () => {
        expect(fallbackOverrides(sourceSans, arial).sizeAdjust).toBe('89.28%');
    });

    it('takes the vertical metrics of the family, at the size of the fallback', () => {
        expect(fallbackOverrides(sourceSans, arial)).toEqual({
            sizeAdjust: '89.28%',
            ascentOverride: '114.7%',
            descentOverride: '44.8%',
            lineGapOverride: '0%',
        });
    });

    it('scales the line gap of the family', () => {
        expect(fallbackOverrides({ ...sourceSans, lineGap: 100 }, arial).lineGapOverride).toBe('11.2%');
    });
});

describe('buildFonts', () => {
    let css: string;
    let rules: ReturnType<typeof parseRules>;

    beforeAll(async () => {
        css = await buildFonts(root);
        rules = parseRules(css);
    });

    /**
     * Finds the rules of the faces of a family, without its fallback face.
     * @param family - The family whose rules to find.
     * @returns The rules, in the order of the file.
     */
    function faces(family: string) {
        return rules.filter((rule) => rule.comment.startsWith(`${family}, `));
    }

    it('starts with a comment that says how the file is made', () => {
        expect(css).toMatch(/^\/\* Generated by design-tokens:build from src\/fonts\.ts/);
    });

    it.each(fonts.map((font) => [font.family, font] as const))(
        'declares a face for each subset that the package of %s ships, in each style',
        async (family, font) => {
            const expected = [
                ...(await packageSubsets(font, 'wght.css')).map((subset) => `${family}, normal, ${subset}`),
                ...(font.styles.includes('italic') ? await packageSubsets(font, 'wght-italic.css') : []).map(
                    (subset) => `${family}, italic, ${subset}`,
                ),
            ];

            expect(faces(family).map((rule) => rule.comment)).toEqual(expected);
        },
    );

    it('loads Manrope upright only, and the other families upright and italic', () => {
        const styles = (family: string) => new Set(faces(family).map((rule) => rule.comment.split(', ')[1]));

        expect(styles('Manrope')).toEqual(new Set(['normal']));
        expect(styles('Source Sans 3')).toEqual(new Set(['normal', 'italic']));
        expect(styles('JetBrains Mono')).toEqual(new Set(['normal', 'italic']));
    });

    it('names each face after the family of its token, and swaps it in once it loads', () => {
        expect(faces('Source Sans 3')[0]?.declarations).toEqual(
            expect.arrayContaining(["font-family: 'Source Sans 3';", 'font-display: swap;']),
        );
    });

    it('declares the weight range of the variable font', () => {
        expect(faces('Manrope')[0]?.declarations).toContain('font-weight: 200 800;');
    });

    it('points at the variable WOFF2 file of each face through a relative path into the package', () => {
        expect(rules.find((rule) => rule.comment === 'JetBrains Mono, italic, latin')?.declarations).toContain(
            "src: url('../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-italic.woff2') format('woff2');",
        );
    });

    it('limits each face to the unicode-range of its subset', () => {
        expect(rules.find((rule) => rule.comment === 'Manrope, normal, latin')?.declarations).toContainEqual(
            expect.stringMatching(/^unicode-range: U\+0000-00FF, /),
        );
    });

    it.each([
        ['Manrope', 'Arial'],
        ['Source Sans 3', 'Arial'],
        ['JetBrains Mono', 'Courier New'],
    ])('declares a fallback face of %s on the local %s, with metric overrides', (family, local) => {
        const fallback = rules.find((rule) => rule.comment.startsWith(`${family} Fallback: `));

        expect(fallback?.declarations).toEqual([
            `font-family: '${family} Fallback';`,
            `src: local('${local}');`,
            expect.stringMatching(/^size-adjust: \d+(\.\d+)?%;$/),
            expect.stringMatching(/^ascent-override: \d+(\.\d+)?%;$/),
            expect.stringMatching(/^descent-override: \d+(\.\d+)?%;$/),
            expect.stringMatching(/^line-gap-override: \d+(\.\d+)?%;$/),
        ]);
    });

    it('computes the fallback metrics from the font files', () => {
        expect(rules.find((rule) => rule.comment.startsWith('Source Sans 3 Fallback: '))?.declarations).toContain(
            'size-adjust: 89.28%;',
        );
    });

    it('fails on a package without a latin subset to read metrics from', async () => {
        const font: FontFamily = {
            family: 'Manrope',
            package: '@fontsource-variable/manrope',
            styles: [],
            fallback: 'Arial',
            generic: 'sans-serif',
        };

        await expect(buildFonts(root, [font])).rejects.toThrow(
            '@fontsource-variable/manrope ships no latin subset in the normal style to read metrics from.',
        );
    });
});
