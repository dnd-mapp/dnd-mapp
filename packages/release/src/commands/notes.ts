import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { releaseNotes, releasesOf } from '../changelog.ts';
import type { Dependencies } from '../cli.ts';
import { ReleaseError } from '../errors.ts';
import { readChangelog, resolveProject } from '../project.ts';

export interface NotesOptions {
    project: string;
    version: string;
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
