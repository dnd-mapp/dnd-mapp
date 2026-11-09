import { readFile, writeFile } from 'node:fs/promises';
import { basename, join, relative, sep } from 'node:path';
import { tryCatch } from '@dnd-mapp/common';
import { type Changelog, parseChangelog } from './changelog.ts';
import { ReleaseError } from './errors.ts';
import { repositoryUrl } from './repository.ts';
import { findPackages, isMissingFile, isRecord, type Layout, parseJson, unscopedName } from './workspace.ts';

/** A project to release, with the paths of its manifest and changelog, and where its tags and compare links point. */
export interface Project {
    /** The name of its package without the scope, which names the project in messages. */
    name: string;
    /** The argument that names the project to the commands: `name` in a workspace, or `undefined` for the only package. */
    argument: string | undefined;
    /** The absolute folder of the project. */
    root: string;
    /** The path of `CHANGELOG.md` in the folder of the project. */
    changelogPath: string;
    /** The path of the changelog relative to the working directory, with forward slashes, for messages. */
    changelogName: string;
    /** The path of `package.json` in the folder of the project. */
    manifestPath: string;
    /** The path of the manifest relative to the working directory, with forward slashes, for messages. */
    manifestName: string;
    /** The web URL of the repository, from the `repository` field of `package.json`, which the compare links start with. */
    repository: string;
    /** The text before the version in a tag of the project: `<name>@v` in a workspace, or `v`. */
    tagPrefix: string;
}

/**
 * Finds the project that `argument` names in the repository at `cwd`: the package of a workspace with that unscoped
 * name, or the package at the root when the repository has one package and `argument` is `undefined`.
 */
export async function resolveProject(layout: Layout, argument: string | undefined, cwd: string): Promise<Project> {
    let root = cwd;

    if (layout.kind === 'workspace') {
        if (argument === undefined) {
            throw new Error('a project in a workspace needs a name');
        }
        const matches = (await findPackages(cwd, layout.patterns)).filter((pkg) => unscopedName(pkg.name) === argument);
        const [match, ...others] = matches;

        if (!match) {
            throw new ReleaseError(`the workspace of ${layout.source} has no package named ${argument}`);
        }
        if (others.length > 0) {
            const list = matches.map((pkg) => `${pkg.name} in ${displayPath(cwd, pkg.root) || '.'}`).join(', ');
            throw new ReleaseError(`${String(matches.length)} packages share the name ${argument}: ${list}`);
        }
        root = match.root;
    }
    const manifestPath = join(root, 'package.json');
    const manifestName = displayPath(cwd, manifestPath);
    const text = await tryCatch(readFile(manifestPath, 'utf8'));

    if (!text.ok) {
        if (isMissingFile(text.error)) {
            throw new ReleaseError(`found no workspace and no package.json in ${cwd}`);
        }
        throw text.error;
    }
    const manifest = parseJson(text.value, manifestName);
    const fields = isRecord(manifest) ? manifest : {};
    const name =
        argument ??
        (typeof fields['name'] === 'string' && fields['name'] !== '' ? unscopedName(fields['name']) : basename(root));
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
        argument,
        root,
        changelogPath,
        changelogName: displayPath(cwd, changelogPath),
        manifestPath,
        manifestName,
        repository,
        tagPrefix: argument === undefined ? 'v' : `${argument}@v`,
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
