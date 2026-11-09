import { access, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { tryCatch } from '@dnd-mapp/common';
import { type Changelog, parseChangelog } from './changelog.ts';
import { ReleaseError } from './errors.ts';
import { repositoryUrl } from './repository.ts';

/** A project to release, with the paths of its manifest and changelog, and where its tags and compare links point. */
export interface Project {
    /** The name of its package without the scope, which names the project in messages. */
    name: string;
    /** The absolute folder of the project. */
    root: string;
    /** The path of `CHANGELOG.md` in the folder of the project. */
    changelogPath: string;
    /** The path of the changelog relative to the root of the repository, with forward slashes, for messages. */
    changelogName: string;
    /** The path of `package.json` in the folder of the project. */
    manifestPath: string;
    /** The path of the manifest relative to the root of the repository, with forward slashes, for messages. */
    manifestName: string;
    /** The web URL of the repository, from the `repository` field of `package.json`, which the compare links start with. */
    repository: string;
    /** The text before the version in a tag of the project: `v` at the root of the repository, or `<name>@v` below it. */
    tagPrefix: string;
}

/**
 * Reads the project in `cwd`: the package whose `package.json` the folder holds. A package at the root of the git
 * repository tags its releases `v<version>`, and a package below it `<name>@v<version>`, with the name of the package
 * without its scope.
 */
export async function resolveProject(cwd: string): Promise<Project> {
    const root = resolve(cwd);
    const repositoryRoot = await findRepositoryRoot(root);
    const manifestPath = join(root, 'package.json');
    const manifestName = displayPath(repositoryRoot, manifestPath);
    const text = await tryCatch(readFile(manifestPath, 'utf8'));

    if (!text.ok) {
        if (isMissingFile(text.error)) {
            throw new ReleaseError(`found no package.json in ${root}; run release in the folder of the package`);
        }
        throw text.error;
    }
    const manifest = parseJson(text.value, manifestName);
    const fields = isRecord(manifest) ? manifest : {};
    const packageName = typeof fields['name'] === 'string' && fields['name'] !== '' ? fields['name'] : undefined;
    const atRoot = relative(repositoryRoot, root) === '';

    if (packageName === undefined && !atRoot) {
        throw new ReleaseError(
            `${manifestName} has no name, which the tags of a package below the root of the repository start with`,
        );
    }
    const name = packageName === undefined ? basename(root) : unscopedName(packageName);
    const repository = repositoryUrl(fields['repository']);

    if (fields['repository'] === undefined) {
        throw new ReleaseError(
            `${manifestName} has no repository field, which the compare links of the changelog need`,
        );
    }
    if (repository === undefined) {
        throw new ReleaseError(
            `the repository field of ${manifestName} holds no URL of a git repository, such as https://github.com/<owner>/<repo>`,
        );
    }
    const changelogPath = join(root, 'CHANGELOG.md');

    return {
        name,
        root,
        changelogPath,
        changelogName: displayPath(repositoryRoot, changelogPath),
        manifestPath,
        manifestName,
        repository,
        tagPrefix: atRoot ? 'v' : `${name}@v`,
    };
}

/**
 * The nearest folder at or above `folder` that holds `.git`: a folder in a clone, and a file in a worktree or a
 * submodule.
 */
async function findRepositoryRoot(folder: string): Promise<string> {
    for (let current = folder; ; current = dirname(current)) {
        const found = await tryCatch(access(join(current, '.git')));

        if (found.ok) {
            return current;
        }
        if (!isMissingFile(found.error)) {
            throw found.error;
        }
        if (dirname(current) === current) {
            throw new ReleaseError(`found no git repository at or above ${folder}`);
        }
    }
}

/** The path relative to `from`, with forward slashes, for messages. */
function displayPath(from: string, path: string): string {
    return relative(from, path).split(sep).join('/');
}

/** The name of a package without its scope, such as `web` for `@dnd-mapp/web`. */
function unscopedName(name: string): string {
    return name.replace(/^@[^/]+\//, '');
}

/** Parses the text of a JSON file, and names the file in the error when it fails. */
function parseJson(text: string, file: string): unknown {
    try {
        return JSON.parse(text) as unknown;
    } catch (error) {
        throw new ReleaseError(`${file} holds invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isMissingFile(error: unknown): boolean {
    return error instanceof Error && 'code' in error && (error.code === 'ENOENT' || error.code === 'ENOTDIR');
}

export async function readChangelog(project: Project): Promise<Changelog> {
    try {
        return parseChangelog(await readFile(project.changelogPath, 'utf8'));
    } catch (error) {
        if (isMissingFile(error)) {
            throw new ReleaseError(`${project.name} has no CHANGELOG.md at ${project.changelogName}`);
        }
        throw error;
    }
}

/** Writes the lines of a changelog, joined with its own line ending. */
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
    const read = await tryCatch(readFile(project.manifestPath, 'utf8'));

    if (!read.ok) {
        if (isMissingFile(read.error)) {
            throw new ReleaseError(`${project.name} has no package.json at ${project.manifestName}`);
        }
        throw read.error;
    }
    const text = read.value;
    const manifest = parseJson(text, project.manifestName);
    const version = isRecord(manifest) ? manifest['version'] : undefined;

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
