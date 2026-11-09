import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { releaseNotes, releasesOf } from '../changelog.ts';
import type { Dependencies } from '../cli.ts';
import { ReleaseError } from '../errors.ts';
import { readChangelog, resolveProject } from '../project.ts';

/** The arguments of `release notes`. */
export interface NotesOptions {
    /** The moon id of the project. */
    project: string;
    /** The version of the release whose notes to write. */
    version: string;
    /** The path of the file to write the notes to, resolved against the working directory. */
    file: string;
}

/** Writes the section of a release to a file, without its heading, as the body of the GitHub Release. */
export async function notes(options: NotesOptions, deps: Dependencies): Promise<void> {
    const project = await resolveProject(options.project, deps);
    const changelog = await readChangelog(project);
    const release = releasesOf(changelog).find((section) => section.version === options.version);

    if (!release) {
        throw new ReleaseError(`${project.changelogName} has no release ${options.version}`);
    }
    const lines = releaseNotes(changelog, release);
    await writeFile(resolve(deps.cwd, options.file), lines.map((line) => `${line}${changelog.eol}`).join(''));

    deps.stdout(`wrote the notes of ${project.id} v${options.version} to ${options.file}\n`);
}
