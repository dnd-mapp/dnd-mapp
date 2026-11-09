import { readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { type Changelog, parseChangelog } from './changelog.ts';
import type { Dependencies } from './cli.ts';
import { ReleaseError } from './errors.ts';

/** A project that moon knows, with the paths of its manifest and changelog. */
export interface Project {
    /** The moon id of the project. */
    id: string;
    /** The absolute folder of the project, as moon reports it. */
    root: string;
    /** The path of `CHANGELOG.md` in the folder of the project. */
    changelogPath: string;
    /** The path of the changelog relative to the working directory, with forward slashes, for messages. */
    changelogName: string;
    /** The path of `package.json` in the folder of the project. */
    manifestPath: string;
    /** The path of the manifest relative to the working directory, with forward slashes, for messages. */
    manifestName: string;
}

export async function resolveProject(id: string, deps: Pick<Dependencies, 'cwd' | 'resolveProject'>): Promise<Project> {
    let root: string;

    try {
        root = await deps.resolveProject(id);
    } catch (error) {
        throw new ReleaseError(error instanceof Error ? error.message : String(error));
    }
    const changelogPath = join(root, 'CHANGELOG.md');
    const manifestPath = join(root, 'package.json');

    return {
        id,
        root,
        changelogPath,
        changelogName: displayPath(deps.cwd, changelogPath),
        manifestPath,
        manifestName: displayPath(deps.cwd, manifestPath),
    };
}

/** The path relative to `cwd`, with forward slashes, for messages. */
function displayPath(cwd: string, path: string): string {
    return relative(cwd, path).split(sep).join('/');
}

export async function readChangelog(project: Project): Promise<Changelog> {
    try {
        return parseChangelog(await readFile(project.changelogPath, 'utf8'));
    } catch (error) {
        if (isMissingFile(error)) {
            throw new ReleaseError(`${project.id} has no CHANGELOG.md at ${project.changelogName}`);
        }
        throw error;
    }
}

export async function writeChangelog(project: Project, changelog: Changelog): Promise<void> {
    await writeFile(project.changelogPath, changelog.lines.join(changelog.eol));
}

/** The text of a `package.json`, and the version it holds. */
export interface Manifest {
    /** The content of the file, which a bump parses to set the version. */
    text: string;
    /** The `version` field. */
    version: string;
}

export async function readManifest(project: Project): Promise<Manifest> {
    let text: string;

    try {
        text = await readFile(project.manifestPath, 'utf8');
    } catch (error) {
        if (isMissingFile(error)) {
            throw new ReleaseError(`${project.id} has no package.json at ${project.manifestName}`);
        }
        throw error;
    }
    const { version } = JSON.parse(text) as { version?: unknown };

    if (typeof version !== 'string') {
        throw new ReleaseError(`${project.manifestName} has no version`);
    }
    return { text, version };
}

/**
 * Sets the top-level version of a `package.json`, and writes it with the indentation, line endings, and final newline
 * of the file. Prettier formats a `package.json` as `JSON.stringify` does, so only the version line changes.
 */
export async function writeManifestVersion(project: Project, manifest: Manifest, version: string): Promise<void> {
    const data = JSON.parse(manifest.text) as Record<string, unknown>;
    data['version'] = version;

    const indent = /^([ \t]+)"/m.exec(manifest.text)?.[1] ?? '  ';
    const eol = manifest.text.includes('\r\n') ? '\r\n' : '\n';
    const end = /\r?\n$/.test(manifest.text) ? eol : '';

    // JSON.stringify escapes the line breaks inside strings, so every \n it returns separates two lines.
    await writeFile(project.manifestPath, `${JSON.stringify(data, null, indent).replaceAll('\n', eol)}${end}`);
}

function isMissingFile(error: unknown): boolean {
    return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}
