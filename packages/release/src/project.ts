import { readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { type Changelog, parseChangelog } from './changelog.ts';
import type { Dependencies } from './cli.ts';
import { ReleaseError } from './errors.ts';

/** A project that moon knows, with the path of its changelog. */
export interface Project {
    id: string;
    root: string;
    changelogPath: string;
    /** The path of the changelog relative to the working directory, with forward slashes, for messages. */
    changelogName: string;
}

export async function resolveProject(id: string, deps: Pick<Dependencies, 'cwd' | 'resolveProject'>): Promise<Project> {
    let root: string;

    try {
        root = await deps.resolveProject(id);
    } catch (error) {
        throw new ReleaseError(error instanceof Error ? error.message : String(error));
    }
    const changelogPath = join(root, 'CHANGELOG.md');
    const nameOf = (path: string) => relative(deps.cwd, path).split(sep).join('/');

    return { id, root, changelogPath, changelogName: nameOf(changelogPath) };
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

function isMissingFile(error: unknown): boolean {
    return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}
