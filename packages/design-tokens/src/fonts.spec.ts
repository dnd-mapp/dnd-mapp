import { fallbackFamily, fonts, fontStack } from './fonts.ts';

describe('fonts', () => {
    it('holds the families of the font.family tokens', () => {
        expect(fonts.map((font) => font.family)).toEqual(['Manrope', 'Source Sans 3', 'JetBrains Mono']);
    });
});

describe('fallbackFamily', () => {
    it('names the fallback face after its family', () => {
        expect(fonts.map((font) => fallbackFamily(font))).toEqual([
            'Manrope Fallback',
            'Source Sans 3 Fallback',
            'JetBrains Mono Fallback',
        ]);
    });
});

describe('fontStack', () => {
    it.each([
        ['Manrope', "'Manrope', 'Manrope Fallback', sans-serif"],
        ['Source Sans 3', "'Source Sans 3', 'Source Sans 3 Fallback', sans-serif"],
        ['JetBrains Mono', "'JetBrains Mono', 'JetBrains Mono Fallback', monospace"],
    ])('stacks %s on its fallback face and its generic family', (family, stack) => {
        expect(fontStack(family)).toBe(stack);
    });

    it('fails on a family that the config lacks', () => {
        expect(() => fontStack('Comic Sans MS')).toThrow(
            'No font in src/fonts.ts has the family Comic Sans MS. Add it, so fonts.css loads it.',
        );
    });
});
