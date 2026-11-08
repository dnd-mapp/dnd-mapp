import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { releasedChangelog, unreleasedChangelog } from '../testing/changelogs.ts';
import { createFixture, type FixtureOptions } from '../testing/fixture.ts';

/** A changelog whose newest release is `version`, with the given body in `Unreleased`. */
function changelogWith(unreleased: string, version = '1.4.2'): string {
    return `# Changelog

## [Unreleased]

${unreleased}
## [${version}] - 2026-10-01

### Added

- Open a map.

[unreleased]: https://github.com/dnd-mapp/dnd-mapp/compare/web@v${version}...HEAD
[${version}]: https://github.com/dnd-mapp/dnd-mapp/releases/tag/web@v${version}
`;
}

async function bump(options: FixtureOptions, ...argv: string[]) {
    const fixture = await createFixture(options);
    const result = await fixture.run('bump', 'web', ...argv);
    return { ...result, fixture };
}

describe('release bump', () => {
    it('releases the first version from 0.0.0', async () => {
        const { code, fixture } = await bump({ changelog: unreleasedChangelog, version: '0.0.0' }, 'auto');

        expect(code).toBe(0);
        expect(await fixture.read('apps/web/CHANGELOG.md')).toBe(`# Changelog

All notable changes to the web app are documented in this file.

## [Unreleased]

## [0.1.0] - 2026-11-06

### Added

- Open a map.

[unreleased]: https://github.com/dnd-mapp/dnd-mapp/compare/web@v0.1.0...HEAD
[0.1.0]: https://github.com/dnd-mapp/dnd-mapp/releases/tag/web@v0.1.0
`);
        expect(await fixture.read('apps/web/package.json')).toBe('{\n  "name": "web",\n  "version": "0.1.0"\n}\n');
    });

    it('releases the next version and updates the compare links', async () => {
        const { code, fixture } = await bump({ changelog: releasedChangelog, version: '0.2.0' }, 'auto');

        expect(code).toBe(0);
        expect(await fixture.read('apps/web/CHANGELOG.md')).toBe(`# Changelog

All notable changes to the web app are documented in this file.

## [Unreleased]

## [0.2.1] - 2026-11-06

### Fixed

- Keep the grid aligned on zoom.

## [0.2.0] - 2026-10-01

### Added

- Draw walls on the map.

## [0.1.0] - 2026-09-01

### Added

- Open a map.

[unreleased]: https://github.com/dnd-mapp/dnd-mapp/compare/web@v0.2.1...HEAD
[0.2.1]: https://github.com/dnd-mapp/dnd-mapp/compare/web@v0.2.0...web@v0.2.1
[0.2.0]: https://github.com/dnd-mapp/dnd-mapp/compare/web@v0.1.0...web@v0.2.0
[0.1.0]: https://github.com/dnd-mapp/dnd-mapp/releases/tag/web@v0.1.0
`);
    });

    it('starts from a yanked release', async () => {
        const changelog = releasedChangelog.replace('## [0.2.0] - 2026-10-01', '## [0.2.0] - 2026-10-01 [YANKED]');
        const { code, fixture } = await bump({ changelog, version: '0.2.0' }, 'auto');

        expect(code).toBe(0);
        expect(await fixture.read('apps/web/CHANGELOG.md')).toContain(
            '## [0.2.1] - 2026-11-06\n\n### Fixed\n\n- Keep the grid aligned on zoom.\n\n## [0.2.0] - 2026-10-01 [YANKED]\n',
        );
    });

    it('leaves a changelog that release lint passes', async () => {
        const { fixture } = await bump({ changelog: releasedChangelog, version: '0.2.0' }, 'auto');

        expect((await fixture.run('lint', 'web')).code).toBe(0);
    });

    it('prints the new version and how it chose the level', async () => {
        const { stdout } = await bump({ changelog: releasedChangelog, version: '0.2.0' }, 'auto');

        expect(stdout).toBe('web v0.2.1: `patch`, computed by `auto` from `### Fixed`\n');
    });

    it('prints the version, level, and reason as JSON', async () => {
        const { stdout } = await bump({ changelog: releasedChangelog, version: '0.2.0' }, 'auto', '--json');

        expect(JSON.parse(stdout)).toEqual({
            version: '0.2.1',
            level: 'patch',
            reason: '`patch`, computed by `auto` from `### Fixed`',
        });
    });

    describe('auto', () => {
        it.each([
            ['major', 'a Removed entry', '### Removed\n\n- Drop the old map format.\n', '2.0.0', '`### Removed`'],
            [
                'major',
                'a breaking entry',
                '### Changed\n\n- **Breaking:** Store maps per campaign.\n',
                '2.0.0',
                'a `**Breaking:**` entry in `### Changed`',
            ],
            [
                'minor',
                'an Added entry',
                '### Fixed\n\n- Fix zoom.\n\n### Added\n\n- Add fog.\n',
                '1.5.0',
                '`### Added`',
            ],
            ['minor', 'a Changed entry', '### Changed\n\n- Rename layers.\n', '1.5.0', '`### Changed`'],
            ['minor', 'a Deprecated entry', '### Deprecated\n\n- Deprecate the grid.\n', '1.5.0', '`### Deprecated`'],
            ['patch', 'a Fixed entry', '### Fixed\n\n- Fix zoom.\n', '1.4.3', '`### Fixed`'],
            ['patch', 'a Security entry', '### Security\n\n- Escape names.\n', '1.4.3', '`### Security`'],
        ])('picks %s for %s', async (level, _, unreleased, version, source) => {
            const { stdout } = await bump({ changelog: changelogWith(unreleased), version: '1.4.2' }, 'auto', '--json');

            expect(JSON.parse(stdout)).toEqual({
                version,
                level,
                reason: `\`${level}\`, computed by \`auto\` from ${source}`,
            });
        });

        it('picks minor instead of major below 1.0.0', async () => {
            const { stdout } = await bump(
                { changelog: changelogWith('### Removed\n\n- Drop the old map format.\n', '0.3.1'), version: '0.3.1' },
                'auto',
                '--json',
            );

            expect(JSON.parse(stdout)).toEqual({
                version: '0.4.0',
                level: 'minor',
                reason: '`minor`, computed by `auto` from `### Removed`, as breaking changes bump the minor version below `1.0.0`',
            });
        });
    });

    describe('an explicit level', () => {
        it('overrides auto', async () => {
            const { stdout } = await bump(
                { changelog: changelogWith('### Fixed\n\n- Fix zoom.\n'), version: '1.4.2' },
                'major',
                '--json',
            );

            expect(JSON.parse(stdout)).toEqual({ version: '2.0.0', level: 'major', reason: '`major`, set explicitly' });
        });

        it('names what auto would pick when it is lower', async () => {
            const { stdout } = await bump(
                { changelog: changelogWith('### Removed\n\n- Drop the old map format.\n'), version: '1.4.2' },
                'patch',
                '--json',
            );

            expect(JSON.parse(stdout)).toEqual({
                version: '1.4.3',
                level: 'patch',
                reason: '`patch`, set explicitly; `auto` would pick `major` from `### Removed`',
            });
        });

        it('releases 1.0.0 from below 1.0.0 with major', async () => {
            const { stdout } = await bump(
                { changelog: changelogWith('### Added\n\n- Add fog.\n', '0.9.3'), version: '0.9.3' },
                'major',
                '--json',
            );

            expect(JSON.parse(stdout)).toMatchObject({ version: '1.0.0' });
        });

        it('fails on an unknown level', async () => {
            const { code, stderr } = await bump({ changelog: releasedChangelog, version: '0.2.0' }, 'huge');

            expect(code).toBe(1);
            expect(stderr).toContain('unknown level huge, expected auto, major, minor, or patch');
        });
    });

    describe('fails and changes nothing', () => {
        it.each<[string, FixtureOptions, string]>([
            [
                'when Unreleased has no entries',
                { changelog: changelogWith(''), version: '1.4.2' },
                'the Unreleased section of apps/web/CHANGELOG.md has no entries',
            ],
            [
                'when package.json holds another version than the newest release',
                { changelog: releasedChangelog, version: '0.3.0' },
                'apps/web/package.json holds 0.3.0, but the newest release in apps/web/CHANGELOG.md is 0.2.0',
            ],
            [
                'when package.json holds another version than 0.0.0 before the first release',
                { changelog: unreleasedChangelog, version: '1.0.0' },
                'apps/web/package.json holds 1.0.0, but apps/web/CHANGELOG.md has no release, which starts from 0.0.0',
            ],
            [
                'when the new version is not above the highest tag',
                { changelog: releasedChangelog, version: '0.2.0', tags: ['web@v0.2.0', 'web@v0.10.0', 'web@v0.9.0'] },
                'v0.2.1 is not above the highest tag web@v0.10.0',
            ],
            [
                'when the new version equals the highest tag',
                { changelog: releasedChangelog, version: '0.2.0', tags: ['web@v0.2.1'] },
                'v0.2.1 is not above the highest tag web@v0.2.1',
            ],
            [
                'when the changelog fails release lint',
                { changelog: releasedChangelog.replace('### Fixed', '### Improved'), version: '0.2.0' },
                'apps/web/CHANGELOG.md breaks Keep a Changelog; run release lint web for the problems',
            ],
            [
                'on an unknown time zone',
                { changelog: releasedChangelog, version: '0.2.0', timeZone: 'Mars/Olympus' },
                'unknown time zone Mars/Olympus',
            ],
        ])('%s', async (_, options, message) => {
            const fixture = await createFixture(options);

            const result = await fixture.run('bump', 'web', 'auto');

            expect(result.code).toBe(1);
            expect(result.stderr).toContain(message);
            expect(await fixture.read('apps/web/CHANGELOG.md')).toBe(options.changelog);
            expect(JSON.parse(await fixture.read('apps/web/package.json'))).toMatchObject({ version: options.version });
        });

        it('passes a tag of the newest release', async () => {
            const { code } = await bump(
                { changelog: releasedChangelog, version: '0.2.0', tags: ['web@v0.2.0'] },
                'auto',
            );

            expect(code).toBe(0);
        });
    });

    describe('the release date', () => {
        const now = '2026-11-06T23:30:00Z';

        it('falls on the day in the time zone of the machine', async () => {
            const { fixture } = await bump(
                { changelog: releasedChangelog, version: '0.2.0', now, timeZone: 'America/New_York' },
                'auto',
            );

            expect(await fixture.read('apps/web/CHANGELOG.md')).toContain('## [0.2.1] - 2026-11-06');
        });

        it('falls on the day in the zone of --timezone', async () => {
            const { fixture } = await bump(
                { changelog: releasedChangelog, version: '0.2.0', now, timeZone: 'America/New_York' },
                'auto',
                '--timezone',
                'Europe/Amsterdam',
            );

            expect(await fixture.read('apps/web/CHANGELOG.md')).toContain('## [0.2.1] - 2026-11-07');
        });

        it.each([
            ['an unknown zone', 'Europe/Atlantis'],
            ['an offset rather than an IANA zone', '+05:00'],
        ])('fails on %s in --timezone', async (_, zone) => {
            const { code, stderr } = await bump(
                { changelog: releasedChangelog, version: '0.2.0' },
                'auto',
                '--timezone',
                zone,
            );

            expect(code).toBe(1);
            expect(stderr).toContain(`unknown time zone ${zone}`);
        });
    });

    it('fails for a project without a package.json', async () => {
        const fixture = await createFixture({ changelog: releasedChangelog });
        await rm(join(fixture.root, 'package.json'));

        const result = await fixture.run('bump', 'web', 'auto');

        expect(result.code).toBe(1);
        expect(result.stderr).toContain('web has no package.json at apps/web/package.json');
    });

    it('keeps the line endings of the changelog and the indentation of package.json', async () => {
        const manifest = '{\r\n    "name": "web",\r\n    "version": "0.2.0",\r\n    "private": true\r\n}\r\n';
        const { fixture } = await bump(
            { changelog: releasedChangelog.replaceAll('\n', '\r\n'), manifest, version: '0.2.0' },
            'auto',
        );

        const changelog = await fixture.read('apps/web/CHANGELOG.md');
        expect(changelog).toContain('## [Unreleased]\r\n\r\n## [0.2.1] - 2026-11-06\r\n');
        expect(changelog.replaceAll('\r\n', '')).not.toContain('\n');
        expect(await fixture.read('apps/web/package.json')).toBe(manifest.replace('0.2.0', '0.2.1'));
    });

    it('sets the top-level version of package.json, not a nested one before it', async () => {
        const manifest = '{\n  "name": "web",\n  "config": {\n    "version": "9.9.9"\n  },\n  "version": "0.2.0"\n}\n';
        const { fixture } = await bump({ changelog: releasedChangelog, manifest, version: '0.2.0' }, 'auto');

        expect(await fixture.read('apps/web/package.json')).toBe(manifest.replace('0.2.0', '0.2.1'));
    });
});
