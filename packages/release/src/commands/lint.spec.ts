import { describe, expect, it, vi } from 'vitest';
import { releasedChangelog, unreleasedChangelog } from '../testing/changelogs.ts';
import { createFixture } from '../testing/fixture.ts';

await vi.hoisted(() => import('@dnd-mapp/testing/file-system'));

async function lint(changelog: string) {
    const fixture = createFixture({ changelog });
    return fixture.run('lint');
}

describe('release lint', () => {
    it.each([
        ['with releases', releasedChangelog],
        ['before the first release', unreleasedChangelog],
    ])('passes a changelog that follows Keep a Changelog %s', async (_, changelog) => {
        const result = await lint(changelog);

        expect(result).toEqual({ code: 0, stdout: 'apps/web/CHANGELOG.md follows Keep a Changelog\n', stderr: '' });
    });

    it('passes a yanked release', async () => {
        const result = await lint(
            releasedChangelog.replace('## [0.2.0] - 2026-10-01', '## [0.2.0] - 2026-10-01 [YANKED]'),
        );

        expect(result.code).toBe(0);
    });

    it('passes a changelog with CRLF line endings', async () => {
        const result = await lint(releasedChangelog.replaceAll('\n', '\r\n'));

        expect(result.code).toBe(0);
    });

    it('reports each problem with its line and fails', async () => {
        const result = await lint(
            releasedChangelog.replace('### Fixed', '### Improved').replace('### Added', '### Misc'),
        );

        expect(result.code).toBe(1);
        expect(result.stderr).toContain('apps/web/CHANGELOG.md:7: unknown category "### Improved"');
        expect(result.stderr).toContain('apps/web/CHANGELOG.md:13: unknown category "### Misc"');
        expect(result.stderr).toContain('apps/web/CHANGELOG.md has 2 problems');
    });

    it.each([
        ['without brackets', '## 0.2.0 - 2026-10-01'],
        ['with a partial version', '## [0.2] - 2026-10-01'],
        ['without a date', '## [0.2.0]'],
        ['with another separator', '## [0.2.0] – 2026-10-01'],
        ['with another marker than [YANKED]', '## [0.2.0] - 2026-10-01 [yanked]'],
    ])('fails on a version heading %s', async (_, heading) => {
        const result = await lint(releasedChangelog.replace('## [0.2.0] - 2026-10-01', heading));

        expect(result.stderr).toContain(`:11: malformed version heading "${heading}"`);
    });

    it.each([
        ['a day that does not exist', '2026-02-30'],
        ['a month without padding', '2026-1-05'],
        ['another format', '01-10-2026'],
    ])('fails on a date with %s', async (_, date) => {
        const result = await lint(releasedChangelog.replace('2026-10-01', date));

        expect(result.stderr).toContain(`:11: invalid date "${date}"`);
    });

    it('fails on versions out of descending order', async () => {
        const result = await lint(
            releasedChangelog
                .replace('## [0.2.0] - 2026-10-01', '## [0.0.9] - 2026-10-01')
                .replace('web@v0.2.0...HEAD', 'web@v0.0.9...HEAD')
                .replace(
                    '[0.2.0]: https://github.com/dnd-mapp/dnd-mapp/compare/web@v0.1.0...web@v0.2.0',
                    '[0.0.9]: https://github.com/dnd-mapp/dnd-mapp/compare/web@v0.1.0...web@v0.0.9',
                ),
        );

        expect(result.stderr).toContain(':17: version 0.1.0 is not below 0.0.9 above it');
    });

    it('fails on a duplicate version', async () => {
        const result = await lint(releasedChangelog.replace('## [0.1.0] - 2026-09-01', '## [0.2.0] - 2026-09-01'));

        expect(result.stderr).toContain(':17: duplicate version 0.2.0');
    });

    it('fails on a release without entries', async () => {
        const result = await lint(releasedChangelog.replace('### Added\n\n- Draw walls on the map.\n\n', ''));

        expect(result.stderr).toContain(':11: release 0.2.0 has no entries');
    });

    it.each([
        [
            'Unreleased',
            releasedChangelog.replace(
                '- Keep the grid aligned on zoom.\n',
                '- Keep the grid aligned on zoom.\n\n### Added\n',
            ),
            ':11: category "### Added" has no entries',
        ],
        [
            'a release',
            releasedChangelog.replace('- Draw walls on the map.\n', '- Draw walls on the map.\n\n### Removed\n'),
            ':17: category "### Removed" has no entries',
        ],
    ])('fails on a category without entries in %s', async (_, changelog, message) => {
        const result = await lint(changelog);

        expect(result.stderr).toContain(message);
    });

    it('fails on a changelog without an Unreleased section', async () => {
        const result = await lint(
            releasedChangelog.replace('## [Unreleased]\n\n### Fixed\n\n- Keep the grid aligned on zoom.\n\n', ''),
        );

        expect(result.stderr).toContain('missing "## [Unreleased]" section above the releases');
    });

    it('fails on a second Unreleased section', async () => {
        const result = await lint(`${unreleasedChangelog}
## [Unreleased]
`);

        expect(result.stderr).toContain(':11: duplicate "## [Unreleased]" section');
    });

    describe('compare links', () => {
        it('fails on a missing compare link', async () => {
            const result = await lint(
                releasedChangelog.replace(
                    '[0.1.0]: https://github.com/dnd-mapp/dnd-mapp/releases/tag/web@v0.1.0\n',
                    '',
                ),
            );

            expect(result.stderr).toContain(
                ':17: missing link reference definition "[0.1.0]: https://github.com/dnd-mapp/dnd-mapp/releases/tag/web@v0.1.0"',
            );
        });

        it('fails on a compare link to another version', async () => {
            const result = await lint(releasedChangelog.replace('web@v0.2.0...HEAD', 'web@v0.1.0...HEAD'));

            expect(result.stderr).toContain(
                ':23: wrong link for [unreleased], expected "https://github.com/dnd-mapp/dnd-mapp/compare/web@v0.2.0...HEAD"',
            );
        });

        it('fails on an Unreleased link before the first release', async () => {
            const result = await lint(
                `${unreleasedChangelog}\n[unreleased]: https://github.com/dnd-mapp/dnd-mapp/compare/web@v0.1.0...HEAD\n`,
            );

            expect(result.stderr).toContain(':11: unexpected link reference definition [unreleased]');
        });

        it('fails on any other link reference definition', async () => {
            const result = await lint(`${releasedChangelog}[docs]: https://dndmapp.dev\n`);

            expect(result.stderr).toContain(':26: unexpected link reference definition [docs]');
        });

        it('fails on a duplicate link reference definition', async () => {
            const result = await lint(
                `${releasedChangelog}[0.1.0]: https://github.com/dnd-mapp/dnd-mapp/releases/tag/web@v0.1.0\n`,
            );

            expect(result.stderr).toContain(':26: duplicate link reference definition [0.1.0]');
        });
    });
});
