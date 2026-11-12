import { findSource, mergeSets, overlaySets, splitSets } from './sets.ts';

const exported = {
    'primitives': {
        color: {
            neutral: { 19: { $value: '#101419', $type: 'color' }, 94: { $value: '#E8ECEF', $type: 'color' } },
        },
    },
    'color/dark': {
        color: { background: { page: { $value: '{color.neutral.19}', $type: 'color' } } },
    },
    'color/light': {
        color: { background: { page: { $value: '{color.neutral.94}', $type: 'color' } } },
    },
    'base': {
        typography: { body: { $value: { fontSizes: '16px' }, $type: 'typography' } },
    },
    '$themes': [],
    '$metadata': { tokenSetOrder: ['primitives', 'color/dark', 'color/light', 'base'] },
};

describe('splitSets', () => {
    it('keys each set by its name, in the order of the export', () => {
        const sets = splitSets(exported);

        expect([...sets.keys()]).toEqual(['primitives', 'color/dark', 'color/light', 'base']);
    });

    it('leaves out $themes and $metadata', () => {
        const sets = splitSets(exported);

        expect(sets.has('$themes')).toBe(false);
        expect(sets.has('$metadata')).toBe(false);
    });
});

describe('mergeSets', () => {
    it('merges the groups that the named sets share', () => {
        const merged = mergeSets(splitSets(exported), ['primitives', 'color/dark']);

        expect(merged).toEqual({
            color: {
                neutral: exported.primitives.color.neutral,
                background: exported['color/dark'].color.background,
            },
        });
    });

    it('keeps the tokens of a set that it does not name', () => {
        const merged = mergeSets(splitSets(exported), ['primitives', 'color/dark']);

        expect(merged).toHaveProperty(['color', 'background', 'page', '$value'], '{color.neutral.19}');
    });

    it('copies the tokens, so a change to the merged tree leaves the sets alone', () => {
        const sets = splitSets(exported);
        const merged = mergeSets(sets, ['color/dark']);

        merged['color'] = { $value: '#000000', $type: 'color' };

        expect(sets.get('color/dark')).toEqual(exported['color/dark']);
    });

    it('fails when two of the named sets hold the same token', () => {
        expect(() => mergeSets(splitSets(exported), ['color/dark', 'color/light'])).toThrow(
            'Set color/light holds color.background.page, which an earlier set already holds.',
        );
    });

    it('fails on a set that the export does not hold', () => {
        expect(() => mergeSets(splitSets(exported), ['color/dim'])).toThrow('The token export has no set color/dim.');
    });
});

describe('overlaySets', () => {
    const sets = splitSets(exported);
    const base = ['primitives', 'base', 'color/dark'];

    it('puts a set in place of the sets it shares a token with', () => {
        expect(overlaySets(sets, base, ['color/light'])).toEqual(['primitives', 'base', 'color/light']);
    });

    it('keeps the sets when the overlay is one of them', () => {
        expect(overlaySets(sets, base, ['color/dark'])).toEqual(base);
    });

    it('keeps a set whose groups the overlay shares, but none of its tokens', () => {
        expect(overlaySets(sets, ['primitives'], ['color/dark'])).toEqual(['primitives', 'color/dark']);
    });

    it('fails on a set that the export does not hold', () => {
        expect(() => overlaySets(sets, base, ['color/dim'])).toThrow('The token export has no set color/dim.');
    });
});

describe('findSource', () => {
    const sets = splitSets(exported);
    const names = ['primitives', 'color/dark', 'base'];

    it('finds the set that holds a token', () => {
        expect(findSource(sets, names, ['color', 'background', 'page'])).toEqual({
            set: 'color/dark',
            path: ['color', 'background', 'page'],
        });
    });

    it('finds the token that an expanded token comes from', () => {
        expect(findSource(sets, names, ['typography', 'body', 'fontSize'])).toEqual({
            set: 'base',
            path: ['typography', 'body'],
        });
    });

    it('searches the named sets only', () => {
        expect(findSource(sets, ['primitives', 'base'], ['color', 'background', 'page'])).toBeUndefined();
    });

    it('finds no token for the path of a group', () => {
        expect(findSource(sets, names, ['color', 'neutral'])).toBeUndefined();
    });
});
