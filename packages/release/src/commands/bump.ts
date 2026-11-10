import { entriesOf, lintChangelog, releaseChangelog, releasesOf, tagOf, unreleasedOf } from '../changelog.ts';
import type { Dependencies } from '../cli.ts';
import { dayIn } from '../date.ts';
import { ReleaseError } from '../errors.ts';
import { chooseLevel, isRequestedLevel, requestedLevels } from '../level.ts';
import { type Project, readChangelog, readManifest, writeChangelog, writeManifestVersion } from '../project.ts';
import { compareVersions, incrementVersion, isVersion } from '../version.ts';

/** The arguments of `release bump`. */
export interface BumpOptions {
    /** The project to release. */
    project: Project;
    /** The level as given, which `bump` checks against `auto`, `major`, `minor`, and `patch`. */
    level: string;
    /** Whether to print the result as JSON, for the workflows. */
    json: boolean;
    /** The IANA time zone of the release date, or `undefined` for the zone of the machine. */
    timeZone: string | undefined;
}

/** Releases the entries in `Unreleased` as the next version, and sets that version in `package.json`. */
export async function bump(options: BumpOptions, deps: Dependencies): Promise<void> {
    const requested = options.level;

    if (!isRequestedLevel(requested)) {
        const expected = `${requestedLevels.slice(0, -1).join(', ')}, or ${requestedLevels.at(-1) ?? ''}`;
        throw new ReleaseError(`unknown level ${requested}, expected ${expected}`);
    }
    const date = dayIn(deps.clock.now(), options.timeZone ?? deps.clock.timeZone());

    const { project } = options;
    const changelog = await readChangelog(project);

    if (lintChangelog(changelog, project).length > 0) {
        throw new ReleaseError(`${project.changelogName} breaks Keep a Changelog; run release lint for the problems`);
    }
    // The changelog passed lint, so it has an Unreleased section.
    const unreleased = unreleasedOf(changelog);

    if (!unreleased || entriesOf(unreleased).length === 0) {
        throw new ReleaseError(`the Unreleased section of ${project.changelogName} has no entries`);
    }

    const manifest = await readManifest(project);
    const newest = releasesOf(changelog)[0]?.version;
    const current = newest ?? '0.0.0';

    if (manifest.version !== current) {
        const source = newest
            ? `the newest release in ${project.changelogName} is ${newest}`
            : `${project.changelogName} has no release, which starts from 0.0.0`;
        throw new ReleaseError(`${project.manifestName} holds ${manifest.version}, but ${source}`);
    }

    const choice = chooseLevel(requested, unreleased, current);
    const version = incrementVersion(current, choice.level);

    const highestTag = await highestTagOf(project, deps);

    if (highestTag && compareVersions(version, highestTag) <= 0) {
        throw new ReleaseError(
            `${project.name} v${version} is not above the highest tag ${tagOf(project, highestTag)}`,
        );
    }

    await writeChangelog(project, releaseChangelog(changelog, project, version, date));
    await writeManifestVersion(project, manifest, version);

    deps.stdout(
        options.json
            ? `${JSON.stringify({ version, level: choice.level, reason: choice.reason })}\n`
            : `${project.name} v${version}: ${choice.reason}\n`,
    );
}

async function highestTagOf(project: Project, deps: Dependencies): Promise<string | undefined> {
    const prefix = project.tagPrefix;
    const versions = (await deps.listTags(prefix))
        .filter((tag) => tag.startsWith(prefix))
        .map((tag) => tag.slice(prefix.length))
        .filter(isVersion);

    return versions.sort(compareVersions).at(-1);
}
