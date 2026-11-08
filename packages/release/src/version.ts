/** A version without prerelease or build metadata, as `major.minor.patch`. */
export type Version = string;

const versionPattern = /^(\d+)\.(\d+)\.(\d+)$/;

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
