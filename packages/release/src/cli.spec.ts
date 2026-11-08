import { describe, expect, it } from 'vitest';
import { createFixture } from './testing/fixture.ts';

describe('release', () => {
    it.each([
        ['verify', ['verify', 'web']],
        ['verify with a version', ['verify', 'web', '0.1.0']],
        ['notes', ['notes', 'web', '0.1.0', 'notes.md']],
        ['lint', ['lint', 'web']],
    ])('fails %s for a project without a CHANGELOG.md', async (_, argv) => {
        const fixture = await createFixture();

        const result = await fixture.run(...argv);

        expect(result.code).toBe(1);
        expect(result.stderr).toContain('web has no CHANGELOG.md');
    });

    it('fails for a project that moon does not know', async () => {
        const fixture = await createFixture();

        const result = await fixture.run('lint', 'api');

        expect(result.code).toBe(1);
        expect(result.stderr).toContain('moon has no project with the id api');
    });

    it('fails on an unknown command and prints the usage', async () => {
        const fixture = await createFixture();

        const result = await fixture.run('publish', 'web');

        expect(result.code).toBe(1);
        expect(result.stderr).toContain('unknown command publish');
        expect(result.stderr).toContain('Usage:');
    });

    it('fails on a missing argument', async () => {
        const fixture = await createFixture();

        const result = await fixture.run('lint');

        expect(result.code).toBe(1);
        expect(result.stderr).toContain('Usage:');
    });
});
