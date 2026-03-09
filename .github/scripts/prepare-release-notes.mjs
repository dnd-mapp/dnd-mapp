import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

function getVersion() {
    const version = process.env['CLEAN_VERSION'];

    if (!version) {
        throw new Error('CLEAN_VERSION environment variable is required.');
    }
    return version;
}

function resolvePaths() {
    return {
        changelog: join(process.cwd(), 'CHANGELOG.md'),
        template: join(process.cwd(), 'docs', 'release-notes-template.md'),
        releaseNotesOutput: join(process.cwd(), '.github', 'release-notes.md'),
    };
}

/**
 * @param paths {{ changelog: string, template: string }}
 * @return {Promise<{changelog: string, template: string}>}
 */
async function readInputFiles(paths) {
    const [changelog, templateRaw] = await Promise.all([
        readFile(paths.changelog, { encoding: 'utf-8' }),
        readFile(paths.template, { encoding: 'utf-8' }),
    ]);

    return {
        changelog: changelog,
        template: templateRaw.trimEnd(),
    };
}

/**
 * @param changelog {string}
 * @return {{preamble: string, body: string, afterSeparator: string}}
 */
function extractUnreleasedSection(changelog) {
    const unreleasedHeading = '## [Unreleased]';
    const unreleasedStart = changelog.indexOf(unreleasedHeading);

    if (unreleasedStart === -1) {
        throw new Error('Could not find an [Unreleased] section in CHANGELOG.md.');
    }
    const contentAfterHeading = changelog.substring(unreleasedStart + unreleasedHeading.length);

    const separatorMatch = /^---$/m.exec(contentAfterHeading);

    if (!separatorMatch) {
        throw new Error('Could not find the --- separator after the [Unreleased] section.');
    }
    return {
        preamble: changelog.substring(0, unreleasedStart),
        body: contentAfterHeading.substring(0, separatorMatch.index),
        afterSeparator: contentAfterHeading.substring(separatorMatch.index + separatorMatch[0].length),
    };
}

/**
 * @param unreleasedBody {string}
 * @return {string}
 */
function buildReleaseNotesBody(unreleasedBody) {
    const subsectionRegex = /###\s+(.+)\n\n([\s\S]*?)(?=\n###\s|\n---|\n##\s|$)/g;
    const filteredSections = [];
    let match;

    while ((match = subsectionRegex.exec(unreleasedBody)) !== null) {
        const heading = match[1].trim();
        const body = match[2].trim();

        if (body === '- (n/a)') continue;
        filteredSections.push(`### ${heading}\n\n${body}`);
    }
    return filteredSections.length > 0 ? filteredSections.join('\n\n') : 'No notable changes.';
}

function buildNewChangelog({ preamble, template, versionedSection, afterSeparator }) {
    return `${preamble}${template}\n\n${versionedSection}\n\n---${afterSeparator}`;
}

/**
 * @param paths {{ changelog: string, releaseNotesOutput: string }}
 * @param newChangelog {string}
 * @param releaseNotesBody {string}
 * @return {Promise<void>}
 */
async function writeOutputFiles(paths, { newChangelog, releaseNotesBody }) {
    await Promise.all([
        writeFile(paths.changelog, newChangelog, { encoding: 'utf-8' }),
        writeFile(paths.releaseNotesOutput, releaseNotesBody, { encoding: 'utf-8' }),
    ]);
}

async function main() {
    const version = getVersion();
    const date = new Date().toISOString().split('T')[0];
    const paths = resolvePaths();

    const { changelog, template } = await readInputFiles(paths);
    const { preamble, body, afterSeparator } = extractUnreleasedSection(changelog);

    const releaseNotesBody = buildReleaseNotesBody(body);
    const versionedSection = `## [${version}] - ${date}\n\n${releaseNotesBody}`;

    const newChangelog = buildNewChangelog({
        preamble,
        template,
        versionedSection,
        afterSeparator,
    });

    await writeOutputFiles(paths, { newChangelog, releaseNotesBody });

    console.log(`\n✓ Updated CHANGELOG.md with version "${version}" (${date}).`);
    console.log(`Release notes written to "${paths.releaseNotesOutput}".`);
}

try {
    await main();
} catch (error) {
    console.error(`✗ Changelog preparation failed: ${error.message}`);
    process.exit(1);
}
