/** A version without prerelease or build metadata, as `major.minor.patch`. */
export type Version = string;

const versionPattern = /^(\d+)\.(\d+)\.(\d+)$/;

export function isVersion(text: string): boolean {
    return versionPattern.test(text);
}

function parts(version: Version): [number, number, number] {
    const match = versionPattern.exec(version);

    if (!match) {
        throw new Error(`not a version: ${version}`);
    }
    return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/** Compares two versions, with a negative result when `a` is lower, and a positive one when it is higher. */
export function compareVersions(a: Version, b: Version): number {
    const [aParts, bParts] = [parts(a), parts(b)];

    for (let i = 0; i < 3; i++) {
        const difference = (aParts[i] ?? 0) - (bParts[i] ?? 0);

        if (difference !== 0) {
            return difference;
        }
    }
    return 0;
}

/** The part of a version that a bump increments. */
export type Level = 'major' | 'minor' | 'patch';

/** Increments the part of `version` at `level`, and resets the parts below it to 0. */
export function incrementVersion(version: Version, level: Level): Version {
    const [major, minor, patch] = parts(version);

    switch (level) {
        case 'major':
            return [major + 1, 0, 0].join('.');
        case 'minor':
            return [major, minor + 1, 0].join('.');
        case 'patch':
            return [major, minor, patch + 1].join('.');
    }
}

/** The major part of `version`. */
export function majorOf(version: Version): number {
    return parts(version)[0];
}
