import type { UnreleasedSection } from './changelog.ts';
import { type Level, majorOf, type Version } from './version.ts';

/** The levels that `release bump` accepts. */
export const requestedLevels = ['auto', 'major', 'minor', 'patch'] as const;

/** A level that `release bump` accepts: `auto`, or a level that it sets explicitly. */
export type RequestedLevel = (typeof requestedLevels)[number];

/** Whether `level` is one that `release bump` accepts. */
export function isRequestedLevel(level: string): level is RequestedLevel {
    return (requestedLevels as readonly string[]).includes(level);
}

/** The level of a bump, and a line that says how it was chosen. */
export interface LevelChoice {
    /** The level to increment the version by. */
    level: Level;
    /** How the level was chosen, which `bump` prints. */
    reason: string;
}

/** The level that `auto` picks from the entries in `Unreleased`, and what decided it. */
interface AutoLevel {
    /** The level that `auto` picks. */
    level: Level;
    /** What in `Unreleased` decided the level, such as "`### Added`". */
    source: string;
    /** Whether a breaking change picked minor, since the version is below `1.0.0`. */
    belowOne: boolean;
}

/** The order of the levels, from lowest to highest, to tell when an explicit level is below the one `auto` picks. */
const rank: Record<Level, number> = { patch: 0, minor: 1, major: 2 };

/** The categories whose entries bump the minor version. */
const minorCategories = new Set(['Added', 'Changed', 'Deprecated']);

/** Chooses the level of a bump from `current`, by the level requested and the entries in `Unreleased`. */
export function chooseLevel(requested: RequestedLevel, unreleased: UnreleasedSection, current: Version): LevelChoice {
    const auto = autoLevel(unreleased, current);

    if (requested === 'auto') {
        const note = auto.belowOne ? ', as breaking changes bump the minor version below `1.0.0`' : '';
        return { level: auto.level, reason: `\`${auto.level}\`, computed by \`auto\` from ${auto.source}${note}` };
    }
    if (rank[requested] < rank[auto.level]) {
        return {
            level: requested,
            reason: `\`${requested}\`, set explicitly; \`auto\` would pick \`${auto.level}\` from ${auto.source}`,
        };
    }
    return { level: requested, reason: `\`${requested}\`, set explicitly` };
}

/**
 * Picks major for a `Removed` entry or a `**Breaking:**` one, minor for an `Added`, `Changed`, or `Deprecated` entry,
 * and patch for any other entry. Below `1.0.0`, it picks minor instead of major.
 */
function autoLevel(unreleased: UnreleasedSection, current: Version): AutoLevel {
    const categories = unreleased.categories.filter((category) => category.entries.length > 0);
    const name = (category: string | null) =>
        category === null ? 'an entry outside a category' : `\`### ${category}\``;

    const removed = categories.find((category) => category.name === 'Removed');
    const breaking = categories.find((category) =>
        category.entries.some((entry) => entry.text.startsWith('**Breaking:**')),
    );
    const major = removed ?? breaking;

    if (major) {
        const source = major === removed ? name(major.name) : `a \`**Breaking:**\` entry in ${name(major.name)}`;
        const belowOne = majorOf(current) === 0;
        return { level: belowOne ? 'minor' : 'major', source, belowOne };
    }

    const minor = categories.find((category) => category.name !== null && minorCategories.has(category.name));

    if (minor) {
        return { level: 'minor', source: name(minor.name), belowOne: false };
    }
    return { level: 'patch', source: name(categories[0]?.name ?? null), belowOne: false };
}
