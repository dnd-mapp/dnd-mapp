import { entriesOf, releasesOf, unreleasedOf } from '../changelog.ts';
import type { Dependencies } from '../cli.ts';
import { ReleaseError } from '../errors.ts';
import { type Project, readChangelog, readManifest } from '../project.ts';
import { isVersion } from '../version.ts';

/** The arguments of `release verify`. */
export interface VerifyOptions {
    /** The project to verify. */
    project: Project;
    /** The version that `package.json` and the newest release must hold, or `undefined` to check `Unreleased`. */
    version: string | undefined;
}

/**
 * Without a version, checks that `Unreleased` has entries to release. With one, checks that `package.json` and the
 * newest release in the changelog both hold it, and ignores `Unreleased`, which a bump has just emptied.
 */
export async function verify(options: VerifyOptions, deps: Dependencies): Promise<void> {
    const { project, version } = options;

    if (version !== undefined && !isVersion(version)) {
        throw new ReleaseError(`invalid version ${version}, expected <major>.<minor>.<patch>`);
    }
    const changelog = await readChangelog(project);

    if (version === undefined) {
        const unreleased = unreleasedOf(changelog);
        const count = unreleased ? entriesOf(unreleased).length : 0;

        if (count === 0) {
            throw new ReleaseError(`the Unreleased section of ${project.changelogName} has no entries`);
        }
        deps.stdout(
            `the Unreleased section of ${project.changelogName} has ${String(count)} ${count === 1 ? 'entry' : 'entries'}\n`,
        );
        return;
    }

    const manifest = await readManifest(project);

    if (manifest.version !== version) {
        throw new ReleaseError(`${project.manifestName} holds ${manifest.version}, not ${version}`);
    }
    const newest = releasesOf(changelog)[0]?.version;

    if (newest === undefined) {
        throw new ReleaseError(`${project.changelogName} has no release, not ${version}`);
    }
    if (newest !== version) {
        throw new ReleaseError(`the newest release in ${project.changelogName} is ${newest}, not ${version}`);
    }
    deps.stdout(`${project.manifestName} and ${project.changelogName} hold ${project.name} v${version}\n`);
}
