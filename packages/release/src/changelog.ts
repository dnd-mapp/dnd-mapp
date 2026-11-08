import { compareVersions, type Version } from './version.ts';

/** The categories of changes that Keep a Changelog defines. */
export const knownCategories = ['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'] as const;

/** A list item at the start of a line, which the parser counts as an entry. */
export interface Entry {
    /** The index of its line. */
    line: number;
    text: string;
}

/** A `### <name>` heading and its entries. Entries above the first category of a section have the name `null`. */
export interface Category {
    name: string | null;
    line: number;
    entries: Entry[];
}

interface SectionBase {
    /** The index of its heading. */
    line: number;
    heading: string;
    /** The index of the line after its last line. */
    end: number;
    categories: Category[];
}

export interface UnreleasedSection extends SectionBase {
    kind: 'unreleased';
}

export interface ReleaseSection extends SectionBase {
    kind: 'release';
    version: Version;
    date: string;
}

/** A `##` heading that is neither `Unreleased` nor a version. */
export interface MalformedSection extends SectionBase {
    kind: 'malformed';
}

export type Section = UnreleasedSection | ReleaseSection | MalformedSection;

export interface LinkDefinition {
    label: string;
    url: string;
    line: number;
}

/** The lines of a changelog and the structure the parser found in them. */
export interface Changelog {
    lines: string[];
    eol: string;
    sections: Section[];
    links: LinkDefinition[];
}

const unreleasedHeading = /^## \[Unreleased\]\s*$/;
// Keep a Changelog marks a release that was pulled with [YANKED] after its date.
const releaseHeading = /^## \[(\d+\.\d+\.\d+)\] - (\S+)(?: \[YANKED\])?\s*$/;
const linkDefinition = /^\[([^\]]+)\]:\s*(\S*)/;
const entry = /^[-*+] /;

export function parseChangelog(text: string): Changelog {
    const eol = text.includes('\r\n') ? '\r\n' : '\n';
    const lines = text.split(/\r?\n/);
    const sections: Section[] = [];
    const links: LinkDefinition[] = [];

    lines.forEach((line, index) => {
        const current = sections.at(-1);
        const link = linkDefinition.exec(line);

        if (link) {
            links.push({ label: link[1] ?? '', url: link[2] ?? '', line: index });
        } else if (line.startsWith('## ') || line.trimEnd() === '##') {
            if (current) {
                current.end = index;
            }
            sections.push(parseHeading(line, index, lines.length));
        } else if (current && line.startsWith('### ')) {
            current.categories.push({ name: line.slice(4).trim(), line: index, entries: [] });
        } else if (current && entry.test(line)) {
            let category = current.categories.at(-1);

            if (!category) {
                category = { name: null, line: index, entries: [] };
                current.categories.push(category);
            }
            category.entries.push({ line: index, text: line.replace(entry, '') });
        }
    });
    return { lines, eol, sections, links };
}

function parseHeading(heading: string, line: number, end: number): Section {
    const base = { line, heading: heading.trimEnd(), end, categories: [] };

    if (unreleasedHeading.test(heading)) {
        return { kind: 'unreleased', ...base };
    }
    const release = releaseHeading.exec(heading);

    if (release) {
        return { kind: 'release', version: release[1] ?? '', date: release[2] ?? '', ...base };
    }
    return { kind: 'malformed', ...base };
}

export function releasesOf(changelog: Changelog): ReleaseSection[] {
    return changelog.sections.filter((section) => section.kind === 'release');
}

export function unreleasedOf(changelog: Changelog): UnreleasedSection | undefined {
    return changelog.sections.find((section) => section.kind === 'unreleased');
}

export function entriesOf(section: Section): Entry[] {
    return section.categories.flatMap((category) => category.entries);
}

const repository = 'https://github.com/dnd-mapp/dnd-mapp';

export function tagOf(project: string, version: Version): string {
    return `${project}@v${version}`;
}

export interface ExpectedLink {
    label: string;
    url: string;
    /** The index of the heading of the section that the link belongs to. */
    line: number;
}

/**
 * The link reference definitions that the headings of a changelog need: one that compares the newest release to
 * `HEAD`, and one per release that compares it to the release below it, or links to the tag of the first release.
 */
export function expectedLinks(changelog: Changelog, project: string): ExpectedLink[] {
    const releases = releasesOf(changelog);
    const [newest] = releases;

    if (!newest) {
        return [];
    }
    const links: ExpectedLink[] = [
        {
            label: 'unreleased',
            url: `${repository}/compare/${tagOf(project, newest.version)}...HEAD`,
            line: unreleasedOf(changelog)?.line ?? newest.line,
        },
    ];
    releases.forEach((release, index) => {
        const previous = releases[index + 1];
        const url = previous
            ? `${repository}/compare/${tagOf(project, previous.version)}...${tagOf(project, release.version)}`
            : `${repository}/releases/tag/${tagOf(project, release.version)}`;
        links.push({ label: release.version, url, line: release.line });
    });
    return links;
}

/** The lines of a release without its heading, the blank lines around them, and the link reference definitions. */
export function releaseNotes(changelog: Changelog, release: ReleaseSection): string[] {
    const links = new Set(changelog.links.map((link) => link.line));
    const lines = changelog.lines
        .slice(release.line + 1, release.end)
        .filter((_, index) => !links.has(release.line + 1 + index));

    const start = lines.findIndex((line) => line.trim() !== '');
    const end = lines.findLastIndex((line) => line.trim() !== '');
    return start === -1 ? [] : lines.slice(start, end + 1);
}

export interface Problem {
    /** The line number, counted from 1. */
    line: number;
    message: string;
}

/** Checks a changelog against Keep a Changelog, and returns its problems in the order of their lines. */
export function lintChangelog(changelog: Changelog, project: string): Problem[] {
    const problems: Problem[] = [];
    const report = (index: number, message: string) => problems.push({ line: index + 1, message });

    lintUnreleased(changelog, report);
    lintSections(changelog, report);
    lintLinks(changelog, project, report);

    return problems.sort((a, b) => a.line - b.line);
}

type Report = (index: number, message: string) => void;

function lintUnreleased({ sections }: Changelog, report: Report): void {
    const [first, ...others] = sections.filter((section) => section.kind === 'unreleased');

    if (!first) {
        report(sections[0]?.line ?? 0, 'missing "## [Unreleased]" section above the releases');
        return;
    }
    if (sections[0] !== first) {
        report(first.line, '"## [Unreleased]" section is not above the releases');
    }
    for (const section of others) {
        report(section.line, 'duplicate "## [Unreleased]" section');
    }
}

function lintSections({ sections }: Changelog, report: Report): void {
    let previous: ReleaseSection | undefined;
    const versions = new Set<Version>();

    for (const section of sections) {
        if (section.kind === 'malformed') {
            report(
                section.line,
                `malformed version heading "${section.heading}", expected "## [<major>.<minor>.<patch>] - <YYYY-MM-DD>", with " [YANKED]" after a pulled release`,
            );
        }
        for (const category of section.categories) {
            if (category.name !== null && !(knownCategories as readonly string[]).includes(category.name)) {
                report(
                    category.line,
                    `unknown category "### ${category.name}", expected one of ${knownCategories.join(', ')}`,
                );
            }
            if (category.name !== null && category.entries.length === 0) {
                report(category.line, `category "### ${category.name}" has no entries`);
            }
        }
        if (section.kind !== 'release') {
            continue;
        }
        if (!isValidDate(section.date)) {
            report(section.line, `invalid date "${section.date}", expected an existing date as YYYY-MM-DD`);
        }
        if (versions.has(section.version)) {
            report(section.line, `duplicate version ${section.version}`);
        } else if (previous && compareVersions(section.version, previous.version) >= 0) {
            report(section.line, `version ${section.version} is not below ${previous.version} above it`);
        }
        if (entriesOf(section).length === 0) {
            report(section.line, `release ${section.version} has no entries`);
        }
        versions.add(section.version);
        previous = section;
    }
}

function isValidDate(date: string): boolean {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

    if (!match) {
        return false;
    }
    const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
    const parsed = new Date(Date.UTC(year, month - 1, day));
    return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
}

function lintLinks(changelog: Changelog, project: string, report: Report): void {
    const expected = new Map(expectedLinks(changelog, project).map((link) => [link.label.toLowerCase(), link]));
    const defined = new Set<string>();

    for (const link of changelog.links) {
        const key = link.label.toLowerCase();
        const expectedLink = expected.get(key);

        if (defined.has(key)) {
            report(link.line, `duplicate link reference definition [${link.label}]`);
        } else if (!expectedLink) {
            report(link.line, `unexpected link reference definition [${link.label}]`);
        } else if (link.url !== expectedLink.url) {
            report(link.line, `wrong link for [${link.label}], expected "${expectedLink.url}"`);
        }
        defined.add(key);
    }
    for (const [key, link] of expected) {
        if (!defined.has(key)) {
            report(link.line, `missing link reference definition "[${link.label}]: ${link.url}"`);
        }
    }
}
