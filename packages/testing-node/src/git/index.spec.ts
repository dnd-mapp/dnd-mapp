import childProcessDefault, { execFile } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const { mockGit } = await vi.hoisted(() => import('./index.ts'));

const execFileAsync = promisify(execFile);

/** Lists the tags of the mocked repository that match `patterns`. */
async function listTags(...patterns: string[]): Promise<string> {
    const { stdout } = await execFileAsync('git', ['tag', '--list', ...patterns], { cwd: '/repo' });

    return stdout;
}

describe('mockGit', () => {
    it('mocks execFile of node:child_process and its default export', async () => {
        mockGit({ tags: ['web@v1.0.0'] });

        expect(await listTags()).toBe('web@v1.0.0\n');
        expect(childProcessDefault.execFile).toBe(execFile);
    });

    it('replaces the state of an earlier call, and holds no tags by default', async () => {
        mockGit({ tags: ['web@v1.0.0'] });
        mockGit();

        expect(await listTags()).toBe('');
    });

    it('rejects a tag that it holds already', () => {
        expect(() => {
            mockGit({ tags: ['web@v1.0.0', 'web@v1.0.0'] });
        }).toThrow('cannot add the tag web@v1.0.0 twice');
    });
});

describe('execFile', () => {
    it('resolves to the output through promisify', async () => {
        mockGit({ tags: ['web@v1.0.0'] });

        expect(await execFileAsync('git', ['tag', '--list'])).toEqual({ stdout: 'web@v1.0.0\n', stderr: '' });
    });

    it('calls back with the output', async () => {
        mockGit({ tags: ['web@v1.0.0'] });

        const output = await new Promise((resolve) => {
            execFile('git', ['tag', '--list'], { cwd: '/repo' }, (error, stdout, stderr) => {
                resolve({ error, stdout, stderr });
            });
        });

        expect(output).toEqual({ error: null, stdout: 'web@v1.0.0\n', stderr: '' });
    });

    it('calls back with an error for a command it does not support', async () => {
        mockGit();

        const error = await new Promise((resolve) => {
            execFile('git', (reason) => {
                resolve(reason);
            });
        });

        expect(error).toEqual(new Error('the git mock does not support git '));
    });

    it('fails for a program other than git', async () => {
        mockGit();

        await expect(execFileAsync('node', ['--version'])).rejects.toThrow('the git mock runs only git, not node');
    });

    it('fails for a git command it does not support', async () => {
        mockGit();

        await expect(execFileAsync('git', ['tag', 'web@v1.0.0'])).rejects.toThrow(
            'the git mock does not support git tag web@v1.0.0',
        );
    });
});

describe('git tag --list', () => {
    const tags = ['web@v0.2.0', 'api@v1.0.0', 'web@v0.10.0', 'web-admin@v3.0.0', 'web@v0.1.0', 'feature/web@v1'];

    it('lists every tag without a pattern, sorted by name', async () => {
        mockGit({ tags });

        expect(await listTags()).toBe(
            'api@v1.0.0\nfeature/web@v1\nweb-admin@v3.0.0\nweb@v0.1.0\nweb@v0.10.0\nweb@v0.2.0\n',
        );
    });

    it('lists the tags that match a pattern with *', async () => {
        mockGit({ tags });

        expect(await listTags('web@v*')).toBe('web@v0.1.0\nweb@v0.10.0\nweb@v0.2.0\n');
    });

    it('matches / with *, and one character with ?', async () => {
        mockGit({ tags });

        expect(await listTags('*web@v?')).toBe('feature/web@v1\n');
    });

    it('lists the tags that match any of several patterns', async () => {
        mockGit({ tags });

        expect(await listTags('api@v*', 'web-admin@v*')).toBe('api@v1.0.0\nweb-admin@v3.0.0\n');
    });

    it('takes the other characters of a pattern as they are', async () => {
        mockGit({ tags: ['web@v1.0.0', 'web@v1x0x0'] });

        expect(await listTags('web@v1.0.0')).toBe('web@v1.0.0\n');
    });

    it('fails for a pattern with wildmatch syntax beyond * and ?', async () => {
        mockGit({ tags });

        await expect(listTags('web@v[0-9]*')).rejects.toThrow('the git mock supports only * and ? in a pattern');
        await expect(listTags('web@v\\*')).rejects.toThrow('the git mock supports only * and ? in a pattern');
    });

    it('lists the same tags as the real git', async () => {
        const real = await vi.importActual<typeof import('node:child_process')>('node:child_process');
        const cwd = await mkdtemp(join(tmpdir(), 'testing-git-'));
        onTestFinished(() => rm(cwd, { recursive: true, force: true }));

        // The repository is a throwaway fixture, so it needs neither the signing nor the identity of the user.
        const git = async (...args: string[]) => {
            const config = [
                'user.name=testing',
                'user.email=testing@example.com',
                'commit.gpgSign=false',
                'tag.gpgSign=false',
            ];
            const { stdout } = await promisify(real.execFile)(
                'git',
                [...config.flatMap((entry) => ['-c', entry]), ...args],
                { cwd },
            );
            return stdout;
        };
        await git('init', '--quiet');
        await git('commit', '--quiet', '--allow-empty', '--message', 'init');
        for (const tag of tags) {
            await git('tag', tag);
        }
        mockGit({ tags });

        for (const patterns of [[], ['web@v*'], ['*web@v?'], ['api@v*', 'web-admin@v*'], ['nope@v*']]) {
            expect(await listTags(...patterns), patterns.join(' ')).toBe(await git('tag', '--list', ...patterns));
        }
    });
});
