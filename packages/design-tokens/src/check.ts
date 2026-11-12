/**
 * Compares a committed file with what the build generates from `tokens.json`.
 * @param file - The path of the file in the package, such as `css/tokens.css`.
 * @param generated - The contents that the build generates.
 * @param committed - The contents of the committed file, or `undefined` when the file is missing.
 * @returns A message that says where the files differ and how to fix it, or `undefined` when they match.
 */
export function checkFile(file: string, generated: string, committed: string | undefined): string | undefined {
    if (committed === generated) {
        return undefined;
    }
    const fix = `Run pnpm moon run design-tokens:build, and commit ${file}.`;

    if (committed === undefined) {
        return `${file} is missing. ${fix}`;
    }
    const generatedLines = generated.split('\n');
    const committedLines = committed.split('\n');
    const line = generatedLines.findIndex((text, index) => text !== committedLines[index]);

    return `${file} differs from what design-tokens:build generates from tokens.json, from line ${String(line === -1 ? generatedLines.length + 1 : line + 1)} on. ${fix}`;
}
