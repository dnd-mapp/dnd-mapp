import { readdir, readFile } from 'node:fs/promises';
import { join, posix } from 'node:path';
import { parse } from 'yaml';
import { ReleaseError } from './errors.ts';

/** How a repository holds its packages: in a workspace, or as one package at its root. */
export type Layout = WorkspaceLayout | SinglePackageLayout;

/** A workspace, whose globs pick the folders of its packages. */
export interface WorkspaceLayout {
    /** Tells a workspace apart from a repository with one package. */
    kind: 'workspace';
    /** The file that holds the globs: `pnpm-workspace.yaml`, or `package.json` for npm and Yarn. */
    source: string;
    /** The globs of the folders of the packages, relative to the root, with `!` before a glob that excludes folders. */
    patterns: string[];
}

/** A repository with one package, at its root. */
export interface SinglePackageLayout {
    /** Tells a repository with one package apart from a workspace. */
    kind: 'single';
}

/** A package of a workspace. */
export interface WorkspacePackage {
    /** The `name` in its `package.json`, with its scope. */
    name: string;
    /** The absolute folder of the package. */
    root: string;
}

/**
 * Reads the layout of the repository in `root`: the `packages` of `pnpm-workspace.yaml`, else the `workspaces` of the
 * root `package.json`, else a single package.
 */
export async function findLayout(root: string): Promise<Layout> {
    const pnpm = await readOptional(join(root, 'pnpm-workspace.yaml'));

    if (pnpm !== undefined) {
        const config = parseYaml(pnpm, 'pnpm-workspace.yaml');
        const patterns = isRecord(config) ? config['packages'] : undefined;

        if (patterns !== undefined) {
            return {
                kind: 'workspace',
                source: 'pnpm-workspace.yaml',
                patterns: expectGlobs(patterns, 'packages', 'pnpm-workspace.yaml'),
            };
        }
    }
    const text = await readOptional(join(root, 'package.json'));
    const manifest = text === undefined ? undefined : parseJson(text, 'package.json');
    // Yarn also takes the globs as the packages of an object, next to its nohoist globs.
    const workspaces = isRecord(manifest) ? manifest['workspaces'] : undefined;
    const patterns = isRecord(workspaces) ? workspaces['packages'] : workspaces;

    if (patterns !== undefined) {
        return {
            kind: 'workspace',
            source: 'package.json',
            patterns: expectGlobs(patterns, 'workspaces', 'package.json'),
        };
    }
    return { kind: 'single' };
}

/**
 * Lists the packages in the folders that the globs of a workspace match, sorted by folder. A folder counts when it holds
 * a `package.json` with a `name`. As in pnpm and npm, a glob that starts with `!` excludes the folders it matches, and no
 * glob reaches into `node_modules` or a folder whose name starts with a dot.
 */
export async function findPackages(root: string, patterns: string[]): Promise<WorkspacePackage[]> {
    const includes = patterns.filter((pattern) => !pattern.startsWith('!')).map(normalizeGlob);
    const excludes = patterns
        .filter((pattern) => pattern.startsWith('!'))
        .map((pattern) => normalizeGlob(pattern.slice(1)));
    const folders = new Set<string>();

    for (const pattern of includes) {
        for (const folder of await expandGlob(root, pattern)) {
            folders.add(folder);
        }
    }
    const packages: WorkspacePackage[] = [];

    for (const folder of [...folders].sort()) {
        // pnpm and npm match the globs against the package.json in each folder, so match the exclusions the same way.
        const manifestPath = posix.join(folder, 'package.json');

        if (excludes.some((pattern) => posix.matchesGlob(manifestPath, posix.join(pattern, 'package.json')))) {
            continue;
        }
        const text = await readOptional(join(root, manifestPath));
        const name = text === undefined ? undefined : nameOf(parseJson(text, manifestPath));

        if (name !== undefined) {
            packages.push({ name, root: join(root, folder) });
        }
    }
    return packages;
}

/** The name of a package without its scope, such as `web` for `@dnd-mapp/web`. */
export function unscopedName(name: string): string {
    return name.replace(/^@[^/]+\//, '');
}

/** Drops the `./` before a glob and the slashes after it, which pnpm and npm ignore. */
function normalizeGlob(pattern: string): string {
    return pattern
        .trim()
        .replace(/^(?:\.\/)+/, '')
        .replace(/\/+$/, '');
}

/** The folders, relative to `root` with forward slashes, that a glob of folders matches, segment by segment. */
async function expandGlob(root: string, pattern: string): Promise<string[]> {
    let folders = [''];

    for (const segment of pattern.split('/').filter((part) => part !== '' && part !== '.')) {
        const next: string[] = [];

        for (const folder of folders) {
            if (segment === '**') {
                next.push(folder, ...(await descendantsOf(root, folder)));
            } else if (/[*?[\]{}!]/.test(segment)) {
                const children = await childrenOf(root, folder);
                next.push(...children.filter((child) => posix.matchesGlob(posix.basename(child), segment)));
            } else {
                next.push(posix.join(folder, segment));
            }
        }
        folders = [...new Set(next)];
    }
    return folders.filter((folder) => folder !== '');
}

/** The folders right below `folder`, without `node_modules` and the folders whose name starts with a dot. */
async function childrenOf(root: string, folder: string): Promise<string[]> {
    try {
        const entries = await readdir(join(root, folder), { withFileTypes: true });

        return entries
            .filter((entry) => entry.isDirectory() && entry.name !== 'node_modules' && !entry.name.startsWith('.'))
            .map((entry) => posix.join(folder, entry.name));
    } catch (error) {
        if (isMissingFile(error)) {
            return [];
        }
        throw error;
    }
}

/** Every folder below `folder`, as `childrenOf` lists them on each level. */
async function descendantsOf(root: string, folder: string): Promise<string[]> {
    const descendants: string[] = [];

    for (const child of await childrenOf(root, folder)) {
        descendants.push(child, ...(await descendantsOf(root, child)));
    }
    return descendants;
}

/** Reads a text file, or returns `undefined` when it, or a folder above it, does not exist. */
async function readOptional(path: string): Promise<string | undefined> {
    try {
        return await readFile(path, 'utf8');
    } catch (error) {
        if (isMissingFile(error)) {
            return undefined;
        }
        throw error;
    }
}

function parseYaml(text: string, file: string): unknown {
    try {
        return parse(text) as unknown;
    } catch (error) {
        throw new ReleaseError(`${file} holds invalid YAML: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/** Parses the text of a JSON file, and names the file in the error when it fails. */
export function parseJson(text: string, file: string): unknown {
    try {
        return JSON.parse(text) as unknown;
    } catch (error) {
        throw new ReleaseError(`${file} holds invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function expectGlobs(value: unknown, field: string, file: string): string[] {
    if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
        throw new ReleaseError(`the ${field} field of ${file} is no list of globs`);
    }
    return value;
}

function nameOf(manifest: unknown): string | undefined {
    const name = isRecord(manifest) ? manifest['name'] : undefined;

    return typeof name === 'string' && name !== '' ? name : undefined;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isMissingFile(error: unknown): boolean {
    return error instanceof Error && 'code' in error && (error.code === 'ENOENT' || error.code === 'ENOTDIR');
}
