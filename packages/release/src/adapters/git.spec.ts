import { execFile } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it, onTestFinished } from 'vitest';
import { listGitTags } from './git.ts';

const execFileAsync = promisify(execFile);

describe('listGitTags', () => {
    /** Creates a git repository in a temporary folder with one commit and the given tags. */
    async function createRepository(tags: string[]): Promise<string> {
        const cwd = await mkdtemp(join(tmpdir(), 'release-git-'));
        onTestFinished(() => rm(cwd, { recursive: true, force: true }));

        // The repository is a throwaway fixture, so it needs neither the signing nor the identity of the user.
        const git = (...args: string[]) =>
            execFileAsync(
                'git',
                [
                    '-c',
                    'user.name=release',
                    '-c',
                    'user.email=release@example.com',
                    '-c',
                    'commit.gpgSign=false',
                    '-c',
                    'tag.gpgSign=false',
                    ...args,
                ],
                { cwd },
            );
        await git('init', '--quiet');
        await git('commit', '--quiet', '--allow-empty', '--message', 'init');
        for (const tag of tags) {
            await git('tag', tag);
        }
        return cwd;
    }

    it('lists the version tags of a project', async () => {
        const cwd = await createRepository(['web@v0.1.0', 'web@v0.2.0', 'api@v1.0.0', 'web-admin@v3.0.0']);

        expect((await listGitTags('web', cwd)).sort()).toEqual(['web@v0.1.0', 'web@v0.2.0']);
    });

    it('lists no tags for a project without releases', async () => {
        const cwd = await createRepository(['api@v1.0.0']);

        expect(await listGitTags('web', cwd)).toEqual([]);
    });
});
