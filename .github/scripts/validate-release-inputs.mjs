import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// --- Constants ---

const ALLOWED_VERSIONS = ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease'];

const ALLOWED_PRERELEASE_IDS = ['alpha', 'beta', 'rc', 'none'];

const PRERELEASE_ID_WEIGHT = { alpha: 0, beta: 1, rc: 2, none: 3 };

const PRERELEASE_INIT_TYPES = ['premajor', 'preminor', 'prepatch'];

// --- SemVer Parsing (no regex) ---

/**
 * Parses a SemVer string into its components.
 * Assumes the version string is valid SemVer as produced by pnpm/npm.
 *
 * @param {string} version
 * @returns {{ major: number, minor: number, patch: number, prerelease: string[] }}
 */
function parseSemVer(version) {
    // Strip build metadata ("+...") — we don't use it, but be safe.
    const plusIndex = version.indexOf('+');
    const base = plusIndex === -1 ? version : version.slice(0, plusIndex);

    const dashIndex = base.indexOf('-');
    const corePart = dashIndex === -1 ? base : base.slice(0, dashIndex);
    const prereleasePart = dashIndex === -1 ? null : base.slice(dashIndex + 1);

    const corePieces = corePart.split('.');

    if (corePieces.length !== 3) {
        throw new Error(`Invalid version format: "${version}"`);
    }
    const [major, minor, patch] = corePieces.map((n) => {
        if (!/^\d+$/.test(n)) {
            throw new Error(`Invalid version segment "${n}" in "${version}"`);
        }
        const num = Number(n);
        if (num > Number.MAX_SAFE_INTEGER) {
            throw new Error(`Version segment "${n}" in "${version}" exceeds safe integer range`);
        }
        return num;
    });

    const prerelease = prereleasePart ? prereleasePart.split('.') : [];

    return { major, minor, patch, prerelease };
}

/**
 * Returns true if the parsed version is a prerelease.
 *
 * @param {{ prerelease: string[] }} parsed
 * @returns {boolean}
 */
function isPrerelease(parsed) {
    return parsed.prerelease.length > 0;
}

/**
 * Returns the prerelease track type ("premajor" | "preminor" | "prepatch" | null)
 * by inspecting the numeric position in the prerelease tuple alongside the core
 * version numbers.
 *
 * pnpm encodes pre-tracks as:
 *   premajor  -> X.0.0-<id>.0  (minor === 0, patch === 0)
 *   preminor  -> X.Y.0-<id>.0  (patch === 0, minor !== 0  OR  minor === 0 check below)
 *   prepatch  -> X.Y.Z-<id>.0
 *
 * We derive the track from the core numbers, mirroring what pnpm does.
 *
 * @param {{ major: number, minor: number, patch: number, prerelease: string[] }} parsed
 * @returns {"premajor" | "preminor" | "prepatch" | null}
 */
function getPrereleaseTrack(parsed) {
    if (!isPrerelease(parsed)) return null;

    const { minor, patch } = parsed;

    if (minor === 0 && patch === 0) return 'premajor';
    if (patch === 0) return 'preminor';
    return 'prepatch';
}

/**
 * Returns the identifier string (e.g. "alpha") from the prerelease tuple,
 * or null if there is none / it is not one of the known identifiers.
 *
 * pnpm produces tuples like ["alpha", 0] or ["rc", 3].
 *
 * @param {{ prerelease: string[] }} parsed
 * @returns {string | null}
 */
function getPrereleaseId(parsed) {
    // The identifier is the first non-numeric element in the prerelease array.
    for (const segment of parsed.prerelease) {
        if (Number.isNaN(Number(segment))) {
            return segment;
        }
    }
    return null;
}

// --- Validation ---

/**
 * @param {string} value
 * @param {string[]} allowed
 * @param {string} inputName
 */
function validateEnum(value, allowed, inputName) {
    if (!allowed.includes(value)) {
        throw new Error(`Invalid ${inputName} "${value}". Must be one of: ${allowed.join(', ')}.`);
    }
}

/**
 * Validates all transition rules and throws a descriptive error on failure.
 *
 * @param {string} versionInput      - The VERSION env var value.
 * @param {string} prereleaseIdInput - The PRERELEASE_ID env var value (defaulted to "none").
 * @param {string} currentVersion    - The raw version string from package.json.
 */
function validate(versionInput, prereleaseIdInput, currentVersion) {
    // --- Input shape validation ---
    validateEnum(versionInput, ALLOWED_VERSIONS, 'version');
    validateEnum(prereleaseIdInput, ALLOWED_PRERELEASE_IDS, 'prerelease-id');

    const parsed = parseSemVer(currentVersion);
    const isCurrentVersionPrerelease = isPrerelease(parsed);
    const currentTrack = getPrereleaseTrack(parsed);
    const currentPrereleaseId = getPrereleaseId(parsed);

    // --- Rule 1: Initializing pre-releases requires a real prerelease-id ---
    if (PRERELEASE_INIT_TYPES.includes(versionInput) && prereleaseIdInput === 'none') {
        throw new Error(
            `Rule 1 violation: Starting a new prerelease track ("${versionInput}") requires an explicit prerelease-id (alpha | beta | rc). "none" is not allowed here.`
        );
    }

    // --- Rule 2: Cannot use "prerelease" on a stable version ---
    if (!isCurrentVersionPrerelease && versionInput === 'prerelease') {
        throw new Error(
            `Rule 2 violation: Cannot use version "prerelease" when the current version (${currentVersion}) is not already a prerelease.`
        );
    }

    // --- Rules 4/5/6: Release track lock-in ---
    if (isCurrentVersionPrerelease) {
        if (currentTrack === 'premajor') {
            // Rule 4
            if (versionInput !== 'prerelease' && versionInput !== 'major') {
                throw new Error(
                    `Rule 4 violation: Current version (${currentVersion}) is on the premajor track. Next version must be "prerelease" or "major", got "${versionInput}".`
                );
            }
        } else if (currentTrack === 'preminor') {
            // Rule 5
            const allowedVersionsPreminor = ['prerelease', 'minor', 'premajor'];

            if (!allowedVersionsPreminor.includes(versionInput)) {
                throw new Error(
                    `Rule 5 violation: Current version (${currentVersion}) is on the preminor track. Next version must be one of: ${allowedVersionsPreminor.join(', ')}, got "${versionInput}".`
                );
            }
        } else if (currentTrack === 'prepatch') {
            // Rule 6
            const allowedVersionsPrepatch = ['prerelease', 'patch', 'preminor', 'premajor'];

            if (!allowedVersionsPrepatch.includes(versionInput)) {
                throw new Error(
                    `Rule 6 violation: Current version (${currentVersion}) is on the prepatch track. Next version must be one of: ${allowedVersionsPrepatch.join(', ')}, got "${versionInput}".`
                );
            }
        }
    }

    // --- Rules 7/8/9: Forward-only identifier progression ---
    // Only applies when staying within the same track (version === "prerelease").
    if (versionInput === 'prerelease' && isCurrentVersionPrerelease && currentPrereleaseId !== null) {
        // "none" as the incoming ID means "promote to stable" — allowed from any ID.
        if (prereleaseIdInput !== 'none') {
            const currentWeight = PRERELEASE_ID_WEIGHT[currentPrereleaseId];
            const nextWeight = PRERELEASE_ID_WEIGHT[prereleaseIdInput];

            if (nextWeight < currentWeight) {
                throw new Error(
                    `Rules 7-9 violation (Forward-Only): Cannot move prerelease identifier from "${currentPrereleaseId}" to "${prereleaseIdInput}". Identifier progression is: alpha -> beta -> rc -> (stable).`
                );
            }
        }
    }
}

// --- Entry Point ---

async function main() {
    const versionInput = process.env['VERSION'];
    const prereleaseIdInput = process.env['PRERELEASE_ID'];

    if (!versionInput) {
        throw new Error('Missing required environment variable: VERSION.');
    }
    const manifestPath = join(process.cwd(), 'package.json');
    const manifestRaw = await readFile(manifestPath, { encoding: 'utf-8' });

    /** @type {Record<string, unknown>} */
    const manifest = JSON.parse(manifestRaw);

    const currentVersion = manifest.version;

    if (!currentVersion || typeof currentVersion !== 'string') {
        throw new Error(`Could not read a valid "version" field from ${manifestPath}.`);
    }
    console.log(`Current version: "${currentVersion}"`);
    console.log(`Version input: "${versionInput}"`);
    console.log(`Prerelease ID: "${prereleaseIdInput}"`);

    validate(versionInput, prereleaseIdInput, currentVersion);

    console.log('\n✓ All transition rules passed.');

    const nextIsPrerelease = PRERELEASE_INIT_TYPES.includes(versionInput) || versionInput === 'prerelease';
    const githubOutput = process.env['GITHUB_OUTPUT'];

    await writeFile(githubOutput, `is-prerelease=${nextIsPrerelease}\n`, { flag: 'a' });
}

try {
    await main();
} catch (error) {
    console.error(`\n✗ Validation failed: ${error.message}`);
    process.exit(1);
}
