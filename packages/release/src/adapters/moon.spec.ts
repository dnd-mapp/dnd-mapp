import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolveMoonProject } from './moon.ts';

describe('resolveMoonProject', () => {
    const workspace = resolve(import.meta.dirname, '../../../..');

    it('resolves a moon id to the folder of its project', async () => {
        const root = await resolveMoonProject('release', workspace);

        expect(resolve(root)).toBe(resolve(import.meta.dirname, '../..'));
    });

    it('resolves an id that differs from the name of its folder', async () => {
        const root = await resolveMoonProject('core-web', workspace);

        expect(resolve(root)).toBe(join(workspace, 'packages', 'core', 'web'));
    });

    it('fails for an id that moon does not know', async () => {
        await expect(resolveMoonProject('nope', workspace)).rejects.toThrow('moon has no project with the id nope');
    });
});
