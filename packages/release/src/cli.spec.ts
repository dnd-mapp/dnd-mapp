import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { releasedChangelog } from './testing/changelogs.ts';
import { createFixture, repositoryField } from './testing/fixture.ts';

await vi.hoisted(() => import('@dnd-mapp/testing/file-system'));

describe('release', () => {
    it.each([
        ['bump', ['bump', 'auto']],
        ['verify', ['verify']],
        ['verify with a version', ['verify', '0.1.0']],
        ['notes', ['notes', '0.1.0', 'notes.md']],
        ['lint', ['lint']],
    ])('fails %s for a project without a CHANGELOG.md', async (_, argv) => {
        const fixture = createFixture();

        const result = await fixture.run(...argv);

        expect(result.code).toBe(1);
        expect(result.stderr).toContain('web has no CHANGELOG.md at apps/web/CHANGELOG.md');
    });

    it('fails on an unknown command and prints the usage', async () => {
        const fixture = createFixture();

        const result = await fixture.run('publish');

        expect(result.code).toBe(1);
        expect(result.stderr).toContain('unknown command publish');
        expect(result.stderr).toContain('Usage:');
    });

    it.each([
        ['--json', ['lint', '--json']],
        ['--timezone', ['verify', '--timezone', 'UTC']],
    ])('fails on %s for a command other than bump', async (option, argv) => {
        const fixture = createFixture();

        const result = await fixture.run(...argv);

        expect(result.code).toBe(1);
        expect(result.stderr).toContain(`${option} applies to bump only`);
    });

    describe('in a package below the root of the repository', () => {
        it('acts on the package in the working directory', async () => {
            const fixture = createFixture({ changelog: releasedChangelog });

            const result = await fixture.run('lint');

            expect(result).toEqual({ code: 0, stdout: 'apps/web/CHANGELOG.md follows Keep a Changelog\n', stderr: '' });
        });

        it('fails with a project argument', async () => {
            const fixture = createFixture({ changelog: releasedChangelog });

            const result = await fixture.run('lint', 'web');

            expect(result.code).toBe(1);
            expect(result.stderr).toContain('expected 0 arguments, got 1');
            expect(result.stderr).toContain('in the working directory');
        });

        it('fails when package.json has no name, which its tags start with', async () => {
            const fixture = createFixture({
                changelog: releasedChangelog,
                manifest: JSON.stringify({ repository: repositoryField }),
            });

            const result = await fixture.run('lint');

            expect(result.code).toBe(1);
            expect(result.stderr).toContain(
                'apps/web/package.json has no name, which the tags of a package below the root of the repository start with',
            );
        });
    });

    describe('in a package at the root of the repository', () => {
        const changelog = releasedChangelog.replaceAll('web@v', 'v');

        it('acts on the package in the working directory', async () => {
            const fixture = createFixture({ atRoot: true, changelog });

            const result = await fixture.run('lint');

            expect(result).toEqual({ code: 0, stdout: 'CHANGELOG.md follows Keep a Changelog\n', stderr: '' });
        });

        it('takes the name of the folder when package.json has no name', async () => {
            const fixture = createFixture({
                atRoot: true,
                changelog,
                manifest: JSON.stringify({ version: '0.2.0', repository: repositoryField }),
            });

            const result = await fixture.run('verify', '0.2.0');

            expect(result).toEqual({ code: 0, stdout: 'package.json and CHANGELOG.md hold repo v0.2.0\n', stderr: '' });
        });
    });

    it('fails without a package.json in the working directory', async () => {
        const fixture = createFixture({ changelog: releasedChangelog });
        await rm(join(fixture.cwd, 'package.json'));

        const result = await fixture.run('lint');

        expect(result.code).toBe(1);
        expect(result.stderr).toContain(
            `found no package.json in ${fixture.cwd}; run release in the folder of the package`,
        );
    });

    it('fails outside a git repository', async () => {
        const fixture = createFixture({ changelog: releasedChangelog, git: false });

        const result = await fixture.run('lint');

        expect(result.code).toBe(1);
        expect(result.stderr).toContain(`found no git repository at or above ${fixture.cwd}`);
    });

    describe('the repository field', () => {
        it('fails when package.json has none', async () => {
            const fixture = createFixture({ changelog: releasedChangelog, manifest: '{ "name": "@dnd-mapp/web" }' });

            const result = await fixture.run('lint');

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

            const result = await fixture.run('lint');

            expect(result.code).toBe(1);
            expect(result.stderr).toContain(
                'the repository field of apps/web/package.json holds no URL of a git repository',
            );
        });
    });
});
