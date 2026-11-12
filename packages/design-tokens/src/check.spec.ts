import { checkCss } from './check.ts';

const generated = ':root {\n    --space-16: 1rem;\n}\n';

describe('checkCss', () => {
    it('passes when the committed CSS matches the build', () => {
        expect(checkCss(generated, generated)).toBeUndefined();
    });

    it('names the first line that differs', () => {
        expect(checkCss(generated, ':root {\n    --space-16: 16px;\n}\n')).toBe(
            'css/tokens.css differs from what design-tokens:build generates from tokens.json, from line 2 on. ' +
                'Run pnpm moon run design-tokens:build, and commit css/tokens.css.',
        );
    });

    it('names the line after the build ends when the committed CSS goes on', () => {
        expect(checkCss(generated, `${generated}:root {}\n`)).toContain('from line 4 on.');
    });

    it('names the line where the committed CSS ends early', () => {
        expect(checkCss(generated, ':root {\n')).toContain('from line 2 on.');
    });

    it('fails when the committed CSS is missing', () => {
        expect(checkCss(generated, undefined)).toBe(
            'css/tokens.css is missing. Run pnpm moon run design-tokens:build, and commit css/tokens.css.',
        );
    });
});
