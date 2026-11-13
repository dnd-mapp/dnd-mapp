import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tryCatch } from '@dnd-mapp/common';
import { buildBreakpoints } from './breakpoints.ts';
import { buildCss } from './build.ts';
import { checkFile } from './check.ts';
import { buildFonts } from './font-faces.ts';

const root = join(import.meta.dirname, '..');
const exported = JSON.parse(await readFile(join(root, 'tokens.json'), 'utf8')) as Record<string, unknown>;
const outputs: ReadonlyMap<string, string> = new Map([
    ['css/tokens.css', await buildCss(exported)],
    ['css/fonts.css', await buildFonts(root)],
    ['scss/breakpoints.scss', buildBreakpoints()],
]);

for (const [file, contents] of outputs) {
    const path = join(root, file);

    if (process.argv.includes('--check')) {
        // design-tokens:check compares the committed files with the build, and writes nothing.
        const committed = await tryCatch(readFile(path, 'utf8'));

        if (!committed.ok && (committed.error as NodeJS.ErrnoException).code !== 'ENOENT') {
            throw committed.error;
        }
        const error = checkFile(file, contents, committed.ok ? committed.value : undefined);

        if (error !== undefined) {
            console.error(error);
            process.exitCode = 1;
        }
    } else {
        await mkdir(dirname(path), { recursive: true });
        await writeFile(path, contents);
    }
}
