import { describe, expect, it, vi } from 'vitest';
import { listGitTags } from './git.ts';

const { mockGit } = await vi.hoisted(() => import('@dnd-mapp/testing/git'));

describe('listGitTags', () => {
    it('lists the version tags of a project', async () => {
        mockGit({ tags: ['web@v0.1.0', 'web@v0.2.0', 'api@v1.0.0', 'web-admin@v3.0.0'] });

        expect(await listGitTags('web', '/repo')).toEqual(['web@v0.1.0', 'web@v0.2.0']);
    });

    it('lists no tags for a project without releases', async () => {
        mockGit({ tags: ['api@v1.0.0'] });

        expect(await listGitTags('web', '/repo')).toEqual([]);
    });
});
