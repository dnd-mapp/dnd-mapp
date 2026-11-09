import { describe, expect, it } from 'vitest';
import { releasedChangelog } from '../testing/changelogs.ts';
import { createFixture } from '../testing/fixture.ts';

/** The released changelog right after a bump to 0.2.1, with an empty `Unreleased` section. */
const bumpedChangelog = releasedChangelog.replace(
    '## [Unreleased]\n\n### Fixed\n\n- Keep the grid aligned on zoom.\n\n',
    '## [Unreleased]\n\n## [0.2.1] - 2026-11-06\n\n### Fixed\n\n- Keep the grid aligned on zoom.\n\n',
);

describe('release verify', () => {
    describe('without a version', () => {
        it('passes when Unreleased has entries', async () => {
            const fixture = await createFixture({ changelog: releasedChangelog });

            const result = await fixture.run('verify', 'web');

            expect(result).toEqual({
                code: 0,
                stdout: 'the Unreleased section of apps/web/CHANGELOG.md has 1 entry\n',
                stderr: '',
            });
        });

        it.each([
            ['has no entries', bumpedChangelog],
            [
                'is missing',
                releasedChangelog.replace('## [Unreleased]\n\n### Fixed\n\n- Keep the grid aligned on zoom.\n\n', ''),
            ],
        ])('fails when Unreleased %s', async (_, changelog) => {
            const fixture = await createFixture({ changelog });

            const result = await fixture.run('verify', 'web');

            expect(result.code).toBe(1);
            expect(result.stderr).toContain('the Unreleased section of apps/web/CHANGELOG.md has no entries');
        });
    });

    describe('with a version', () => {
        it('passes when package.json and the newest release hold the version, and ignores Unreleased', async () => {
            const fixture = await createFixture({ changelog: bumpedChangelog, version: '0.2.1' });

            const result = await fixture.run('verify', 'web', '0.2.1');

            expect(result).toEqual({
                code: 0,
                stdout: 'apps/web/package.json and apps/web/CHANGELOG.md hold web v0.2.1\n',
                stderr: '',
            });
        });

        it.each([
            ['package.json holds another version', '0.2.0', '0.2.1', 'apps/web/package.json holds 0.2.0, not 0.2.1'],
            [
                'the newest release is another version',
                '0.2.0',
                '0.2.0',
                'the newest release in apps/web/CHANGELOG.md is 0.2.1, not 0.2.0',
            ],
            ['the version is malformed', '0.2.1', 'v0.2.1', 'invalid version v0.2.1, expected <major>.<minor>.<patch>'],
        ])('fails when %s', async (_, manifestVersion, version, message) => {
            const fixture = await createFixture({ changelog: bumpedChangelog, version: manifestVersion });

            const result = await fixture.run('verify', 'web', version);

            expect(result.code).toBe(1);
            expect(result.stderr).toContain(message);
        });

        it('fails before the first release', async () => {
            const fixture = await createFixture({ changelog: '# Changelog\n\n## [Unreleased]\n', version: '0.1.0' });

            const result = await fixture.run('verify', 'web', '0.1.0');

            expect(result.code).toBe(1);
            expect(result.stderr).toContain('apps/web/CHANGELOG.md has no release, not 0.1.0');
        });
    });
});
