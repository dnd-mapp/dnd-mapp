/**
 * Compares the committed `tokens.css` with the CSS that the build generates from `tokens.json`.
 * @param generated - The CSS that the build generates.
 * @param committed - The contents of the committed `tokens.css`, or `undefined` when the file is missing.
 * @returns A message that says where the files differ and how to fix it, or `undefined` when they match.
 */
export function checkCss(generated: string, committed: string | undefined): string | undefined {
    if (committed === generated) {
        return undefined;
    }
    const fix = 'Run pnpm moon run design-tokens:build, and commit css/tokens.css.';

    if (committed === undefined) {
        return `css/tokens.css is missing. ${fix}`;
    }
    const generatedLines = generated.split('\n');
    const committedLines = committed.split('\n');
    const line = generatedLines.findIndex((text, index) => text !== committedLines[index]);

    return `css/tokens.css differs from what design-tokens:build generates from tokens.json, from line ${String(line === -1 ? generatedLines.length + 1 : line + 1)} on. ${fix}`;
}
