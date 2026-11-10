import { describe, expect, it, vi } from 'vitest';
import { releasedChangelog } from '../testing/changelogs.ts';
import { createFixture } from '../testing/fixture.ts';

await vi.hoisted(() => import('@dnd-mapp/testing/file-system'));

describe('release notes', () => {
    it('writes the section of a version to a file, without its heading', async () => {
        const fixture = createFixture({ changelog: releasedChangelog });

        const result = await fixture.run('notes', '0.2.0', 'notes.md');

        expect(result).toEqual({ code: 0, stdout: 'wrote the notes of web v0.2.0 to notes.md\n', stderr: '' });
        expect(await fixture.read('apps/web/notes.md')).toBe('### Added\n\n- Draw walls on the map.\n');
    });

    it('leaves out the link reference definitions below the oldest release', async () => {
        const fixture = createFixture({ changelog: releasedChangelog });

        await fixture.run('notes', '0.1.0', 'notes.md');

        expect(await fixture.read('apps/web/notes.md')).toBe('### Added\n\n- Open a map.\n');
    });

    it('keeps the line endings of the changelog', async () => {
        const fixture = createFixture({ changelog: releasedChangelog.replaceAll('\n', '\r\n') });

        await fixture.run('notes', '0.2.0', 'notes.md');

        expect(await fixture.read('apps/web/notes.md')).toBe('### Added\r\n\r\n- Draw walls on the map.\r\n');
    });

    it('fails for a version that the changelog does not hold', async () => {
        const fixture = createFixture({ changelog: releasedChangelog });

        const result = await fixture.run('notes', '0.3.0', 'notes.md');

        expect(result.code).toBe(1);
        expect(result.stderr).toContain('apps/web/CHANGELOG.md has no release 0.3.0');
    });
});
