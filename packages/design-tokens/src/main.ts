import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tryCatch } from '@dnd-mapp/common';
import { buildCss } from './build.ts';
import { checkCss } from './check.ts';

const root = join(import.meta.dirname, '..');
const file = join(root, 'css', 'tokens.css');
const exported = JSON.parse(await readFile(join(root, 'tokens.json'), 'utf8')) as Record<string, unknown>;
const css = await buildCss(exported);

if (process.argv.includes('--check')) {
    // design-tokens:check compares the committed file with the build, and writes nothing.
    const committed = await tryCatch(readFile(file, 'utf8'));

    if (!committed.ok && (committed.error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw committed.error;
    }
    const error = checkCss(css, committed.ok ? committed.value : undefined);

    if (error !== undefined) {
        console.error(error);
        process.exitCode = 1;
    }
} else {
    await mkdir(join(root, 'css'), { recursive: true });
    await writeFile(file, css);
}
