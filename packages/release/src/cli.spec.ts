import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { releasedChangelog } from './testing/changelogs.ts';
import { createFixture } from './testing/fixture.ts';

await vi.hoisted(() => import('@dnd-mapp/testing/file-system'));

describe('release', () => {
    it.each([
        ['bump', ['bump', 'web', 'auto']],
        ['verify', ['verify', 'web']],
        ['verify with a version', ['verify', 'web', '0.1.0']],
        ['notes', ['notes', 'web', '0.1.0', 'notes.md']],
        ['lint', ['lint', 'web']],
    ])('fails %s for a project without a CHANGELOG.md', async (_, argv) => {
        const fixture = createFixture();

        const result = await fixture.run(...argv);

        expect(result.code).toBe(1);
        expect(result.stderr).toContain('web has no CHANGELOG.md at apps/web/CHANGELOG.md');
    });

    it('fails on an unknown command and prints the usage', async () => {
        const fixture = createFixture();

        const result = await fixture.run('publish', 'web');

        expect(result.code).toBe(1);
        expect(result.stderr).toContain('unknown command publish');
        expect(result.stderr).toContain('Usage:');
    });

    it.each([
        ['--json', ['lint', 'web', '--json']],
        ['--timezone', ['verify', 'web', '--timezone', 'UTC']],
    ])('fails on %s for a command other than bump', async (option, argv) => {
        const fixture = createFixture();

        const result = await fixture.run(...argv);

        expect(result.code).toBe(1);
        expect(result.stderr).toContain(`${option} applies to bump only`);
    });

    describe('in a workspace', () => {
        it('finds a project by the name of its package without the scope', async () => {
            const fixture = createFixture({ changelog: releasedChangelog });

            const result = await fixture.run('lint', 'web');

            expect(result).toEqual({ code: 0, stdout: 'apps/web/CHANGELOG.md follows Keep a Changelog\n', stderr: '' });
        });

        it('fails without a project', async () => {
            const fixture = createFixture({ changelog: releasedChangelog });

            const result = await fixture.run('lint');

            expect(result.code).toBe(1);
            expect(result.stderr).toContain('expected 1 argument, got 0');
            expect(result.stderr).toContain('Usage:');
        });

        it('fails for a name that no package of the workspace has', async () => {
            const fixture = createFixture();

            const result = await fixture.run('lint', 'api');

            expect(result.code).toBe(1);
            expect(result.stderr).toContain('the workspace of pnpm-workspace.yaml has no package named api');
        });

        it('fails when two packages share the name without the scope', async () => {
            const fixture = createFixture({
                changelog: releasedChangelog,
                files: { 'apps/admin/package.json': '{ "name": "@other/web" }' },
            });

            const result = await fixture.run('lint', 'web');

            expect(result.code).toBe(1);
            expect(result.stderr).toContain(
                '2 packages share the name web: @other/web in apps/admin, @dnd-mapp/web in apps/web',
            );
        });
    });

    describe('in a repository with one package', () => {
        const changelog = releasedChangelog.replaceAll('web@v', 'v');

        it('finds the package at the root, without a project argument', async () => {
            const fixture = createFixture({ layout: 'single', changelog });

            const result = await fixture.run('lint');

            expect(result).toEqual({ code: 0, stdout: 'CHANGELOG.md follows Keep a Changelog\n', stderr: '' });
        });

        it('fails with a project argument', async () => {
            const fixture = createFixture({ layout: 'single', changelog });

            const result = await fixture.run('lint', 'web');

            expect(result.code).toBe(1);
            expect(result.stderr).toContain('expected 0 arguments, got 1');
            expect(result.stderr).toContain('leave it out');
        });

        it('fails without a package.json', async () => {
            const fixture = createFixture({ layout: 'single', changelog });
            await rm(join(fixture.root, 'package.json'));

            const result = await fixture.run('lint');

            expect(result.code).toBe(1);
            expect(result.stderr).toContain(`found no workspace and no package.json in ${fixture.cwd}`);
        });
    });

    describe('the repository field', () => {
        it('fails when package.json has none', async () => {
            const fixture = createFixture({ changelog: releasedChangelog, manifest: '{ "name": "@dnd-mapp/web" }' });

            const result = await fixture.run('lint', 'web');

            expect(result.code).toBe(1);
            expect(result.stderr).toContain(
                'apps/web/package.json has no repository field, which the compare links of the changelog need',
            );
        });

        it('fails when it holds no URL of a git repository', async () => {
            const fixture = createFixture({
                changelog: releasedChangelog,
                manifest: '{ "name": "@dnd-mapp/web", "repository": "gitlab:dnd-mapp/dnd-mapp" }',
            });

            const result = await fixture.run('lint', 'web');

            expect(result.code).toBe(1);
            expect(result.stderr).toContain(
                'the repository field of apps/web/package.json holds no URL of a git repository',
            );
        });
    });
});
