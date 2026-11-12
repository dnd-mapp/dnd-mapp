import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { buildCss } from './build.ts';

const root = join(import.meta.dirname, '..');
const exported = JSON.parse(await readFile(join(root, 'tokens.json'), 'utf8')) as Record<string, unknown>;

await mkdir(join(root, 'css'), { recursive: true });
await writeFile(join(root, 'css', 'tokens.css'), await buildCss(exported));
