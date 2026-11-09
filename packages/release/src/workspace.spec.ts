import { join, resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { findLayout, findPackages, unscopedName } from './workspace.ts';

const { mockFileSystem } = await vi.hoisted(() => import('@dnd-mapp/testing/file-system'));

const root = resolve('/repo');

/** A `package.json` with a name. */
const named = (name: string) => JSON.stringify({ name });

/** Mocks the repository with files by their path relative to its root. */
function mockRepository(files: Record<string, string>): void {
    mockFileSystem(Object.fromEntries(Object.entries(files).map(([path, content]) => [join(root, path), content])));
}

describe('findLayout', () => {
    it('reads the packages of pnpm-workspace.yaml', async () => {
        mockRepository({
            'pnpm-workspace.yaml': 'packages:\n  - apps/*\n  - "!apps/legacy"\ncatalog:\n  yaml: ~2.9.1\n',
            'package.json': JSON.stringify({ workspaces: ['ignored/*'] }),
        });

        expect(await findLayout(root)).toEqual({
            kind: 'workspace',
            source: 'pnpm-workspace.yaml',
            patterns: ['apps/*', '!apps/legacy'],
        });
    });

    it('reads the workspaces of package.json, as npm and Yarn take them', async () => {
        mockRepository({ 'package.json': JSON.stringify({ workspaces: ['packages/*'] }) });

        expect(await findLayout(root)).toEqual({ kind: 'workspace', source: 'package.json', patterns: ['packages/*'] });
    });

    it('reads the packages of the workspaces object of Yarn', async () => {
        mockRepository({
            'package.json': JSON.stringify({ workspaces: { packages: ['packages/*'], nohoist: ['**/react'] } }),
        });

        expect(await findLayout(root)).toEqual({ kind: 'workspace', source: 'package.json', patterns: ['packages/*'] });
    });

    it('falls back to package.json when pnpm-workspace.yaml holds only settings', async () => {
        mockRepository({ 'pnpm-workspace.yaml': 'minimumReleaseAge: 4320\n', 'package.json': named('maps') });

        expect(await findLayout(root)).toEqual({ kind: 'single' });
    });

    it('reads a repository without a workspace as one package', async () => {
        mockRepository({ 'package.json': named('maps') });

        expect(await findLayout(root)).toEqual({ kind: 'single' });
    });

    it.each([
        ['invalid YAML', { 'pnpm-workspace.yaml': 'packages: [apps/*\n' }, 'pnpm-workspace.yaml holds invalid YAML'],
        ['invalid JSON', { 'package.json': '{ "workspaces": ' }, 'package.json holds invalid JSON'],
        [
            'packages that are no list of globs',
            { 'pnpm-workspace.yaml': 'packages: apps/*\n' },
            'the packages field of pnpm-workspace.yaml is no list of globs',
        ],
        [
            'workspaces that are no list of globs',
            { 'package.json': JSON.stringify({ workspaces: [1] }) },
            'the workspaces field of package.json is no list of globs',
        ],
    ])('fails on %s', async (_, files, message) => {
        mockRepository(files);

        await expect(findLayout(root)).rejects.toThrow(message);
    });
});

describe('findPackages', () => {
    it('lists the packages in the folders that the globs match, sorted by folder', async () => {
        mockRepository({
            'packages/release/package.json': named('@dnd-mapp/release'),
            'apps/web/package.json': named('@dnd-mapp/web'),
            'packages/core/web/package.json': named('@dnd-mapp/core-web'),
        });

        expect(await findPackages(root, ['apps/*', 'packages/*', 'packages/*/*'])).toEqual([
            { name: '@dnd-mapp/web', root: join(root, 'apps', 'web') },
            { name: '@dnd-mapp/core-web', root: join(root, 'packages', 'core', 'web') },
            { name: '@dnd-mapp/release', root: join(root, 'packages', 'release') },
        ]);
    });

    it('matches a folder by its path, with ./ before it and a slash after it', async () => {
        mockRepository({ 'tools/release/package.json': named('release') });

        expect(await findPackages(root, ['./tools/release/'])).toEqual([
            { name: 'release', root: join(root, 'tools', 'release') },
        ]);
    });

    it('matches the folders at any depth with **, but not in node_modules or a folder that starts with a dot', async () => {
        mockRepository({
            'libs/a/package.json': named('a'),
            'libs/group/b/package.json': named('b'),
            'libs/node_modules/c/package.json': named('c'),
            'libs/.cache/d/package.json': named('d'),
        });

        expect((await findPackages(root, ['libs/**'])).map((pkg) => pkg.name)).toEqual(['a', 'b']);
    });

    it('matches a segment with a brace pattern', async () => {
        mockRepository({ 'apps/web/package.json': named('web'), 'apps/api/package.json': named('api') });

        expect((await findPackages(root, ['apps/{web,admin}'])).map((pkg) => pkg.name)).toEqual(['web']);
    });

    it('leaves out the folders that a glob after ! matches', async () => {
        mockRepository({
            'apps/web/package.json': named('web'),
            'apps/legacy/package.json': named('legacy'),
            'packages/maps/test/fixture/package.json': named('fixture'),
            'packages/maps/package.json': named('maps'),
        });

        const packages = await findPackages(root, ['apps/*', 'packages/**', '!apps/legacy', '!**/test/**']);

        expect(packages.map((pkg) => pkg.name)).toEqual(['web', 'maps']);
    });

    it('skips a folder without a package.json, or with one without a name', async () => {
        mockRepository({
            'apps/web/package.json': named('web'),
            'apps/docs/README.md': '# Docs\n',
            'apps/draft/package.json': JSON.stringify({ private: true }),
        });

        expect((await findPackages(root, ['apps/*', 'missing/*'])).map((pkg) => pkg.name)).toEqual(['web']);
    });

    it('fails on a package.json with invalid JSON, and names it', async () => {
        mockRepository({ 'apps/web/package.json': '{' });

        await expect(findPackages(root, ['apps/*'])).rejects.toThrow('apps/web/package.json holds invalid JSON');
    });
});

describe('unscopedName', () => {
    it.each([
        ['@dnd-mapp/web', 'web'],
        ['web', 'web'],
        ['@dnd-mapp/core-web', 'core-web'],
    ])('turns %s into %s', (name, expected) => {
        expect(unscopedName(name)).toBe(expected);
    });
});
