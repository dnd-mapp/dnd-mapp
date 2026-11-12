import { checkFile } from './check.ts';

const generated = ':root {\n    --space-16: 1rem;\n}\n';

describe('checkFile', () => {
    it('passes when the committed CSS matches the build', () => {
        expect(checkFile('css/tokens.css', generated, generated)).toBeUndefined();
    });

    it('names the first line that differs', () => {
        expect(checkFile('css/tokens.css', generated, ':root {\n    --space-16: 16px;\n}\n')).toBe(
            'css/tokens.css differs from what design-tokens:build generates from tokens.json, from line 2 on. ' +
                'Run pnpm moon run design-tokens:build, and commit css/tokens.css.',
        );
    });

    it('names the line after the build ends when the committed CSS goes on', () => {
        expect(checkFile('css/tokens.css', generated, `${generated}:root {}\n`)).toContain('from line 4 on.');
    });

    it('names the line where the committed CSS ends early', () => {
        expect(checkFile('css/tokens.css', generated, ':root {\n')).toContain('from line 2 on.');
    });

    it('fails when the committed CSS is missing', () => {
        expect(checkFile('css/tokens.css', generated, undefined)).toBe(
            'css/tokens.css is missing. Run pnpm moon run design-tokens:build, and commit css/tokens.css.',
        );
    });
});
