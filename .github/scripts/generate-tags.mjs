import { writeFile } from 'fs/promises';

/**
 * Generates a comma-separated string of tags based on a semver input.
 * @param {string} tag - The raw tag (e.g., "v1.2.3" or "v1.2.3-alpha.4")
 * @returns {string}
 */
function generateTags(tag) {
    // Remove the leading 'v' if present
    const version = tag.startsWith('v') ? tag.slice(1) : tag;

    // Check if it's a pre-release (alpha, beta, rc)
    // Logic: semver pre-releases contain a hyphen
    const isPreRelease = version.includes('-');

    if (isPreRelease) {
        // For pre-releases, we only return the version without the 'v'
        return version;
    }
    // For stable releases, split into components
    const [major, minor, patch] = version.split('.');

    if (!major || !minor || !patch) {
        throw new Error(`Invalid tag format: ${tag}`);
    }
    const tags = ['latest', major, `${major}.${minor}`, `${major}.${minor}.${patch}`];

    return tags.join(',');
}

async function main() {
    const rawTag = process.env['GITHUB_REF_NAME'];

    if (!rawTag) {
        console.error('Error: "GITHUB_REF_NAME" is not set.');
        process.exit(1);
    }
    const tags = generateTags(rawTag);

    const githubOutput = process.env['GITHUB_OUTPUT'];
    await writeFile(githubOutput, `tags=${tags}\n`, { flag: 'a' });
}

try {
    await main();
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
